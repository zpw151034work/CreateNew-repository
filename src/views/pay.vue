<template>
  <div id="pay" :style="{ height: clientHeight + 'px' }">
    <div class="footer" :style="{ height: height + 'px' }">
      <div class="text">请选择支付方式</div>
      <div class="item" @click="onWeiXin">
        <img class="payBtn" src="../../static/icon/weixin.png" alt="">
        <span>微信支付</span>
      </div>
      <div class="item" :class="{'active': form.pay_mode == 3}" @click="onDuiGong">
        <img class="payBtn" src="../../static/icon/accounts.png" alt="">
        <span>对公转账</span>
      </div>
      <div class="infoBox">
        <div v-for="item in bank" :key="item.id" class="duigong" v-show="form.pay_mode == 3">
          <p>开户行：<span>{{item.bank}}</span></p>
          <p>账<i></i>号：<span>{{item.card_number}}</span></p>
          <p>名<i></i>称：<span>{{item.account_name}}</span></p>
          <p>税<i></i>号：<span>{{item.tax_num}}</span></p>
          <p>地<i></i>址：<span>{{item.address}}</span></p>
        </div>
      </div>
    </div>
    <div class="fixBtn">
      <div class="fixItem" @click="copy(phone)">
        <img src="../assets/img/phone-icon.png"/>
        <span>{{phone}}</span>
      </div>
      <div class="fixItem" @click="copy(weixin)">
        <img src="../assets/img/weixin-icon.png"/>
        <span>{{weixin}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import ICONdg from '../../static/icon/duigong.png'
import TOOL from '../tools.js'
import axios from 'axios';
import $ from 'jquery'

export default {
  name: 'pay',
  props: {
    
  },
  created() {
    if (TOOL.getFacility() == "Weixin") {
      this.isAliPay = false;
    } else {
      this.isAliPay = true;
    }
  },
  mounted() {
    let that = this;

    this.form.price_id = this.$route.query.price_id;
    this.form.level_name = this.$route.query.level_name;
    this.form.price = this.$route.query.price;
    this.form.user_number = this.$route.query.user_number;
    this.form.total_price = this.$route.query.total_price;
    this.form.remarks = this.$route.query.remarks;

    console.log(JSON.stringify(this.form));

    this.getBank();
    TOOL.setDefaultShare();

    var clientWidth = document.documentElement.clientWidth;
    this.height = this.clientHeight - ( 10 * 10*(clientWidth / 320) );
  },
  data() {
    return {
      phone: '010-88447940',
      weixin: 'z13521561449',
      isAliPay: true,
      ICONdg: ICONdg,
      active: 0,
      order_id: '',
      order_code: '',
      form: {
        // user_id: '',
        price_id: '',
        level_name: '',
        price: '',
        user_number: '',
        total_price: '',
        remarks: '',
        pay_mode: '',
      },
      clientHeight: document.documentElement.clientHeight,
      height: 0,
      bank: [
        {
          id: '',
          bank: '',
          bank_name: '',
          account_name: '',
          card_number: '',
          tax_num: '',
          address: ''
        }
      ]
    }
  },
  methods: {
    // 复制
    copy(msg){
      var input = document.createElement("input");  
      input.value = msg;
      document.body.appendChild(input);
      input.select(); 
      document.execCommand("Copy");  
      document.body.removeChild(input); 
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    GetQueryValue1(name) {
       let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      if(window.location.hash.indexOf("?") < 0){
              return null;
      }
      let r = window.location.hash.split("?")[1].match(reg); 　　
      if (r != null) return decodeURIComponent(r[2]); 
  　　    return null;
    },
    // 获取对公转账信息
    getBank () {
      let that = this;
      this.$http.fetch('BankAccount/getList', {
        // company_pid: that.$global.agent_id || 0,
        company_pid: 0, // 目前付款统一打入云美摄账号，参数只能传0
        type: 1
      })
        .then(res => {
          that.bank = res.data
        })
    },
    onWeiXin () {
      this.form.pay_mode = 2;
      let that = this;
      let jsonpayInfo = localStorage.getItem('payInfo');
      
      if(jsonpayInfo) {
        let payInfo = JSON.parse(jsonpayInfo);

        this.form = {
          ...that.form,
          ...payInfo
        }
      }

      this.getOrder(()=>{
        if (that.order_id != '') {
          that.setOrder();
        } else {
          that.createOrder();
        }
      });
    },
    onAliPay () {
      this.form.pay_mode = 1;

      this.getOrder(()=>{
        if (that.order_id != '') {
          that.setOrder();
        } else {
          that.createOrder();
        }
      });
    },
    onDuiGong () {
      this.form.pay_mode = 3;
    },
    // 根据临时用户id查询订单
    getOrder (callback) {
      let that = this;
      let company_id = this.GetQueryValue1('company_id')
      let tmp_uid = this.GetQueryValue1('tmp_uid')

      this.order_id = '';
      this.$http.fetch('/Order/stateus', {
        tmp_uid: tmp_uid,
        company_id: company_id
      })
        .then(res => {
TOOL.alert(' 根据临时用户ID查询订单 = ' + JSON.stringify(res.data))
          if (res.errNo == 0 && res.data && res.data.length > 0) {
            res.data.some((order) => {
              if (order.state == 0) {
                that.order_id = order.id;
                return true;
              }
              return false;
            });
          }
          callback();
        })
    },
    // 创建订单
    createOrder () {
      let company_id = this.GetQueryValue1('company_id')
      let form = this.form;
      let that = this;


TOOL.alert(' 创建订单 上传数据 = ' + JSON.stringify({
        ...form,
        company_id: company_id
      }))

      this.$http.post('/Order/create', {
        ...form,
        company_id: company_id
      }, that)
        .then(res => {
          if (res.errNo == 0 && res.data) {
            /*this.$message({
              message: '创建订单成功',
              type: 'success'
            });*/

            that.order_id = res.data.order_id;
            that.order_code = res.data.order_code;
            that.getWxPay();
          }
        })
    },
    // 修改订单
    setOrder () {
      let company_id = this.GetQueryValue1('company_id')
      let form = this.form;
      let newForm = {};
      let that = this;

      Object.keys(form).map(key => {
        if (form[key] != undefined && form[key] != '') {
          newForm[key] = form[key]
        }
      })

TOOL.alert(' 修改订单 上传数据 = ' + JSON.stringify({
        ...newForm,
        company_id: company_id,
        order_id: that.order_id
      }))

      this.$http.post('/Order/update', {
        ...newForm,
        company_id: company_id,
        order_id: that.order_id
      }, that)
        .then(res => {
          if (res.errNo == 0) {
            TOOL.alert(' 修改订单 返回参数 = ' + JSON.stringify(res))
            that.order_code = res.data.order_code;

            /*this.$message({
              message: '修改订单成功',
              type: 'success'
            });*/

            that.getWxPay();
          }
        })
    },
    // 获取微信支付数据
    getWxPay() {
      let that = this;
      let company_id = this.GetQueryValue1('company_id')
      let tmp_uid = this.GetQueryValue1('tmp_uid')

      /*this.$confirm('是否支付成功', {
        showClose: false,
        closeOnClickModal: false,
        confirmButtonText: '成功',
        cancelButtonText: '重新支付',
        type: 'warning'
      }).then(() => {
        that.$router.replace({path: '/payment', query: {
          order_id: that.order_id
        }});
      })*/

      if(that.form.pay_mode == 2) {
          let openid = localStorage.getItem('openid');
          // if(TOOL.getFacility() == 'Weixin') {
          var payUrl = `http://cailing.meisheapp.com/wxpay/controller/wxpay.php?openid=${openid}&orderid=${that.order_code}&money=${that.form.total_price * 100}&level_name=${encodeURIComponent(that.form.level_name)}&remarks=${encodeURIComponent(that.form.remarks) || '暂无'}#path=/payment,order_id=${that.order_id},company_id=${company_id}&tmp_uid=${tmp_uid}`;
          TOOL.alert(' 跳转支付 = ' + payUrl)
          window.location.href = payUrl;

          // $.ajax({
          //   type: 'post',
          //   data: {
          //     order: that.order_id,
          //     money: that.form.price,
          //     // openid: that.$global.parm,
          //     openid: 'ov9BB0hesTEk61cSnFi60LdHF2E4',
          //     attach: "from:qlb"
          //   },
          //   url: 'http://yms.yuchukeji.cn/pay/Index/wxpayJsapiParameters',
          //   success(res) {
          //     console.log(res)
          //     if(res.errNo == 0) {
          //       let params = JSON.parse(res.data.params)
          //       that.toWxPay(params)
          //     } else {
          //       alert(res.msg)
          //     }
          //   },
          //   error(err) {
          //     console.log(err)
          //   }
          // })
        // } else {

        // }
      } 
      else if(that.form.pay_mode == 1) {
        alert('支付宝功能开通中...')
      }
    },
    // 调用微信支付
    toWxPay(form) {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
            "appId": form.appId,  
            "timeStamp": form.timeStamp,  
            "nonceStr": form.nonceStr,  
            "package": form.package,  
            "signType": form.signType,  
            "paySign": form.paySign,  
            "notify_url": 'http://cailing.meisheapp.com/qlb/#/share'
        },
        function (res) {
            alert(res.err_msg);
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                // 使用以上方式判断前端返回,微信团队郑重提示：
                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            }
        });
    }
  }
}
</script>

<style lang="scss" scoped>
#pay {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // flex-wrap: wrap;
  .item {
      height: 2.6rem;
      border-radius:4px;
      margin-bottom: 1rem;
      border:1px solid rgba(121,212,228,1);
      position: relative;

      &.active::after {
        content: '';
        width: 0.5rem;
        height: 0.5rem;
        border-right: 1px solid rgba(121,212,228,1);
        border-bottom: 1px solid rgba(121,212,228,1);
        background: #fff;
        position: absolute;
        left: 50%;
        bottom: -0.3rem;
        transform: translate(-50%, 0) rotate(45deg);
      }

      span {
        font-size:0.9rem;
        font-family:PingFang-SC-Regular,PingFang-SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height: 2.6rem;
        vertical-align: middle;
      }
    }
  .text {
    font-size: 0.8rem;
    padding: 1.5rem 0rem;
    font-family: 'PingFang-SC-Bold','PingFang-SC';
    font-weight: bold;
    color:rgba(51,51,51,1);
    line-height: 1.1rem;
  }
  .infoBox {
    min-height: 4rem;

    .duigong{
      font-size: .7rem;
      line-height:0.85rem;
      text-align: left;
      // font-family: 'PingFang-SC-Bold','PingFang-SC';
      color: #757575;
      font-weight: 400;
      line-height: 1rem;

      p{
        padding-bottom: 0.5rem;

        span{
          display: inline-block;
          width: calc( 100% - 3.55rem );
          vertical-align: top;
          font-weight: 600;
          color: #333333;
        }
        i{
          padding-left: 0.7rem;
        }
      }
    }
  }
  .payBtn {
    width: 1.7rem;
    height: 1.7rem;
    vertical-align: middle;
    margin-right: 0.3rem;
  }
  .footer {
    width: 100%;
    margin: auto;
    text-align: center;
    overflow: scroll;
    padding: 0rem 0.5rem;
    box-sizing: border-box;

    button {
      margin-top: 0.5rem;
      width: 100%;
    }
  }
  .fixBtn {
    position: fixed;
    bottom: 10px;
    left: 15px;
    right: 15px;
    box-sizing: border-box;
    padding: 10px 0px;
    height:40px;
    background:rgba(121,212,228,1);
    border-radius:4px;
    overflow: hidden;
    z-index: 10;

    .fixItem {
      width: calc( 50% - 1px );
      height: 100%;
      box-sizing: border-box;
      padding: 0px 0.8rem;
      color: #fff;
      font-size: 0.6rem;
      float: left;
      text-align: center;

      img{
        width: 26px;
        height: 22px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 0.2rem;
      }
      span{ 
        vertical-align: middle;
      }

      &:first-child{
        border-right: solid 1px #fff;
      }
    }
  }
}
</style>
