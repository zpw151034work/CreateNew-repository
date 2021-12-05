<template>
  <div id="payment">
    <div class="pay-status-box">
      <div class="status-left">
        <div class="status-name">状态</div>
        <div class="status-type">{{typeNC}}</div>
      </div>
      <el-popover
        placement="bottom"
        trigger="click">
        <div class="www" @click="copy(www)">
          公司管理员可登陆<br/>
          <span>{{www}}</span><br/>
          统一添加号码
        </div>
        <div slot="reference" class="ba">查看管理网址 <img src="../../static/icon/you.png"></div>
      </el-popover>
    </div>
    <div class="buttons-outer">
      <div class="buttons">
        <el-button @click="onNewPhone" :style="{ width: btnWidth }" round>
        <img src="../../static/icon/user.png">
        追加开通新号码</el-button>
        <el-button @click="onCreate" :style="{ width: btnWidth }" round>
        <img src="../../static/icon/code.png">
        生成我的邀请卡</el-button>
      </div>
    </div>
    <div class="tab">
      <div class="title">
        目前已添加{{list.length}}人，剩余可添加{{surplusAdd}}人
      </div>
      <el-table
        :data="list"
        :row-class-name="tableRowClassName"
        style="width: 100%;">
        <el-table-column
          prop="real_name"
          label="姓名"
          min-width="80">
          <div slot-scope="scope" v-html="scope.row.real_name"></div>
        </el-table-column>
        <el-table-column
          class-name="phone"
          header-align="left"
          align="left"
          prop="telephone"
          label="手机号"
          min-width="104">
        </el-table-column>
        <el-table-column
          header-align="left"
          prop="level_name"
          label="开通时长"
          align="left"
          min-width="66">
        </el-table-column>
        <el-table-column
          header-align="left"
          align="left"
          prop="telephoneNc"
          label="运营商"
          min-width="70">
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="code">
      二维码分享给员工填写号码
    </div> -->
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
import TOOL from '../tools.js'
import CONFIG from "../../config/index.js";
export default {
  name: 'payment',
  props: {
    
  },
  created () {
    let that = this;
    let company_id = this.GetQueryValue1('company_id');
    let tmp_uid = this.GetQueryValue1('tmp_uid');

    if(company_id != null && company_id != '') {
      this.company_id = company_id;
    }else {
      this.company_id = parseInt(that.getQueryStringByName('company_id'));
    }
    if(tmp_uid != null && tmp_uid != '') {
      this.tmp_uid = tmp_uid;
    }else {
      this.tmp_uid = parseInt(that.getQueryStringByName('tmp_uid'));
    }

    this.getOrder(() => {
      this.getInfo();
    });
    TOOL.setDefaultShare();
    this.getSurpulsAdd();

    var clientWidth = document.documentElement.clientWidth;
    this.width = 13 * 10*(clientWidth / 320);
    this.btnWidth =  (clientWidth - 55) / 2 + 'px';

    this.intervalGet();
  },
  mounted () {
    localStorage.removeItem('payInfo');
  },
  data () {
    return {
      phone: '010-88447940',
      weixin: 'z13521561449',
      www: 'http://cailing.meisheapp.com',
      list: [],
      type: 0,
      width: 0,
      btnWidth: 0,
      company_id: 0,
      tmp_uid: 0,
      order_users: {
        order_id: ''
      },
      //剩余可添加
      surplusAdd:0,
      // 轮询
      interval: false
    }
  },
  computed: {
    typeNC: function() {
      let values = ['未支付', '已支付', '支付失败', '退款中', '已退款'];
      return values[this.type];
    }
  },
  methods: {
    intervalGet() {
      let that = this;
      this.interval = setInterval(() => {
        that.getOrder(() => {
          that.getInfo();
        });
        that.getSurpulsAdd();
      }, 5000)
    },
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
    getQueryStringByName(name) {
      var result = location.href.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
      if (result == null || result.length < 1) {
          return "";
      }
      return result[1];
    },
    // 获取信息
    getInfo () {
      let that = this,
          params = {
            company_id: that.company_id
          };

      this.$http.fetch('/user/getList',params)
        .then(function(res){
          // that.list = res.data;
          let newList = [];
          res.data.forEach(item => {
            let real_name = '';

            if(item.real_name && item.real_name.length > 4) {
              for(let i = 0; i < item.real_name.length; i++) {
                if(i!= 0 && i%4 == 0) {
                  real_name += '<br/>';
                }
                real_name += item.real_name[i];
              }
            }else {
              real_name = item.real_name;
            }

            newList.push({
              ...item,
              real_name: real_name,
              telephoneNc: that.telepToNc(item.telephone_type)
            })

            let user_counter = that.order_users[item.order_id];
            if (user_counter) ++user_counter.count;
          });
          for (let k in that.order_users) {
            if (k != 'order_id') {
              let user_counter = that.order_users[k];
              if (user_counter.count < user_counter.max_count) {
                that.order_users.order_id = k;
                break;
              }
            }
          }
          that.list = newList;
        });
    },
    // 查询订单状态
    getOrder (callback) {
      let that = this;

      this.type = 0;
      TOOL.alert(' 通过临时用户id查询状态 = ' + this.tmp_uid + ',' + this.company_id)
      this.$http.fetch('/Order/stateus', {
        tmp_uid: that.tmp_uid,
        company_id: that.company_id
      })
        .then((res) => {
          if (res.errNo == 0 && res.data && res.data.length > 0) {
            res.data.forEach((order) => {
              if (order.state == 1) {
                that.type = 1;
                that.order_users[order.id] = {
                  max_count: order.user_number,
                  count: 0
                };
              }
            });
          }
          callback();
        })
    },
    // 添加新号码
    onNewPhone () {
      let that = this;

      this.$router.push({path: '/account', query: {
        company_id: that.company_id,
        tmp_uid: that.tmp_uid
      }});
    },
    //剩余可添加人数
    getSurpulsAdd(){
      let that = this;
      let params = {
            company_id: that.company_id
          };
      this.$http.fetch('/Company/getUserNum',params)
        .then(function(res){
          that.surplusAdd = res.data.buy_max - res.data.use_max;
          that.checkPhone();
        });
    },
    checkPhone() {
      let signInfo = sessionStorage.getItem('signInfo');

      if(signInfo && that.surplusAdd > 0) {
        signInfo = JSON.parse(signInfo);
        let phone = signInfo.contact_telephone;
        if (!(telStr.test(phone))) {
          return false;
        } else {
          this.$http.fetch("/taobao-tcc/cc/json/mobile_tel_segment.htm",{tel:phone}).then(res => {
            var obj = eval(res);
              if (obj.catName == "中国电信") {
                this.userAdd(3)
              } else if (obj.catName == "中国联通") {
                this.userAdd(2)
              } else {
                this.userAdd(1)
              }
          })
        }
      }
    },
    userAdd(telephone_type) {
      let that = this;
      let signInfo = sessionStorage.getItem('signInfo');

      if(signInfo && that.surplusAdd > 0) {
        signInfo = JSON.parse(signInfo);

        var data = {
          user_name: signInfo.contacts,
          telephone: signInfo.phone,
          verification_code: signInfo.verification_code,
          telephone_type: telephone_type,
          company_id: that.company_id,
          order_id: that.order_users.order_id
        };

        this.$http.post('/user/add', data).then(res => {
          if (res.errNo != 0) {
            this.$alert("注册失败，请通过邀请卡重新注册");
          }
        })
      }
    },

    // 生成我的邀请卡
    onCreate () {
      let that = this;
      if (that.order_users.order_id != '')
        window.location.href = `${CONFIG.ROOT}#/share?company_id=${that.company_id}&tmp_uid=${that.tmp_uid}&order_id=${that.order_users.order_id}`
      else
        this.$alert("目前可添加手机号数量已满，请追加开通新号码");
    },
    // 运营商转换
    telepToNc (t) {
      let typeNC = ''
      switch(t) {
        case 1:
          typeNC = '移动';
          break;
        case 2:
          typeNC = '联通';
          break;
        case 3:
          typeNC = '电信';
          break;
      }
      return typeNC
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex % 2 == 0) {
        return 'gray-row';
      }
      return '';
    }
  },
  beforeDestroy() {
    if(this.interval) {
      clearInterval(this.interval);
    }
  }
}
</script>

<style lang="scss" scoped>
.ba {
  user-select: none;
 -webkit-user-select: none;
 -webkit-tap-highlight-color: transparent; 
  -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
  border-color:transparent !important;
  box-shadow: none !important;
}
.ba:before, .ba:after {
  display: none;
}
.el-table:before {
  display: none;
}
.www {
  span {
    white-space: nowrap;
  }
}
#payment {
  box-sizing: border-box;
  padding: 2rem 0rem 0rem 0rem;
  // background-color: #F2F2F2;

  .el-table {
    padding-bottom: 60px;

    .cell {
      font-size: .75rem;
    }
  }

  .pay-status-box{
    width: 100%;
    height: 5.8rem;
    padding: 0 0.75rem;
    background-image: url('../../static/icon/payment_head.png');
    background-size: cover;
    background-position: right;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    position: relative;
    border-bottom: solid 1px #fff;

    .status-left{
      width: 50%;

      .status-name {
        font-size: .8rem;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height: 1.1rem;
      }
      .status-type{
        font-size:1.2rem;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height: 1.65rem;
        margin-top: .5rem;
      }
    }
    .status-img-right{
      width: 50%;
      img{
        width: 50%;
        height: audo;
        margin-left: 35%;
      }
    }
  }
  .buttons-outer{
    width: 100%;
    background-color: #F2F2F2;
    padding-bottom: 0.5rem;
  }

  .buttons {
    width: 100%;
    padding: 1rem 0.75rem;
    box-sizing: border-box;
    text-align: left;
    background: #fff;
    color: #FFFFFF;
    overflow: hidden;

    button {
      // width: 8rem;
      display: inline-block;
      color: #fff;
      height: 2rem;
      font-size: 0.7rem;

      &:first-child {
        background: linear-gradient(180deg,rgba(253,188,124,1) 0%,rgba(254,121,119,1) 100%);
      }
      &:last-child {
        background: linear-gradient(180deg,rgba(124,193,253,1) 0%,rgba(127,119,254,1) 100%);
        float: right;
      }

      img {
        width: 0.9rem;
        height: 0.9rem;
        vertical-align: middle;
        margin-right: 0.25rem;
      }
    }
  }

  .names {
    background:rgba(255,255,255,1);
    width: 100%;
    // height: 4.2rem;
    padding: .75rem;
    box-sizing: border-box;

    .name {
      font-size: 0.8rem;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:1.1rem;
      margin-top: 0.5rem;
      display: flex;
      
      .name-title{
        width: 2.5rem;
        text-align: left;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        box-sizing: border-box;
        background: transparent;
        border: solid 1px #999999;
      }
      .name-phone{
        width: 5.2rem;
        margin: 0 1.5rem 0 1rem
      }
    }
  }
  .type {
    padding: 2rem 0rem;
    text-align: center;
    font-size: 1.4rem;
  }
  .code {
    text-align: center;
    font-size: 0.8rem;
  }
  .tab {
    background: #fff;
    
    padding-top: 0.75rem; 

    .title {
      width: 90%;
      height: 1.4rem;
      border: solid 1px rgba(242,242,242,1);
      border-radius: 0.2rem;
      font-size: 0.6rem;
      font-weight: 600;
      color: #999999;
      line-height: 1.4rem;
      margin: auto;
      text-align: center;
    }
  }
  .ba {
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translate(0, -50%);
    vertical-align: middle;
    font-size: 0.7rem;
    color: #757575;

    img {
      width: 0.6rem;
      height: 0.6rem;
      position: relative;
      top: 0.06rem;
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
