<template>
  <div id="share">
  	<div class="img">
      <div class="box">
        <div class="company" v-html="company"></div>
        <div class="name">{{name}}</div>
      </div>
      <div id="QRCodeNone"></div>
      <a id="img" href="javascript:void(0);" v-if="isIOS">
        <div id="qrcode" ref="qrcode"></div>
      </a>
      <div id="img" v-if="!isIOS">
        <div id="qrcode" ref="qrcode"></div>
      </div>
  	</div>
  	<!-- <div class="buttons">
      <div round>请分享邀请卡给员工填写号码</div>
  		<div class="b" type="primary" round>请长按图片保存</div>
  	</div> -->
    <div class="guide" v-if="guide" @click="()=>{guide = false}">
      <div class="guideInner" ref="guide"></div>
      <div class="img1">
        <img src="../../static/icon/箭头1.png" />
        <div>点击分享按钮，分享给员工</div>
      </div>
      <div class="img2" ref="guideImg2">
        <div>长按二维码保存</div>
        <img src="../../static/icon/箭头2.png" />
      </div>
      <div class="img3">
        <img src="../../static/icon/我知道了.png" />
      </div>
    </div>
    <vue-canvas-poster :widthPixels="1000" :painting="painting" @success="success" @fail="fail"></vue-canvas-poster>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import CONFIG from "../../config/index.js";
import TOOL from '../tools';
import bus from '../bus.js';

const wx = require("weixin-js-sdk");

export default {
  name: 'share',
  props: {
    
  },
  created() {
    let that = this;
    if(that.GetQueryValue1('company_id') && that.GetQueryValue1('company_id') != '') {
      this.company_id = that.GetQueryValue1('company_id');
    }else {
      this.company_id = parseInt(that.getQueryStringByName('company_id'));
    }
    if(that.GetQueryValue1('order_id') && that.GetQueryValue1('order_id') != '') {
      this.order_id = that.GetQueryValue1('order_id');
    }else {
      this.order_id = parseInt(that.getQueryStringByName('order_id'));
    }

    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;

    if (isAndroid) {
      this.isIOS = false;
    }
    this.getCompanyInfo()

    this.isWx = TOOL.getFacility() == 'Weixin';
  },
  mounted() {
    this.$nextTick(() => {
      this.qrcode();
      this.custom();
    });
    bus.$on('onShare', () => {
      // this.onShare()
    })
  },
  data () {
  	return {
  		code: '',
      isIOS: true,
      name: '',
      company: '',
      guide: true,
      isWx: false,
      company_id: 0,
      order_id: 0
  	}
  },
  methods: {
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
    // 自定义分享配置
    custom () {
      console.log('share')
      let that = this;

      let shareDate = {
        access_token: localStorage.getItem('access_token'),
        url: location.href.split('#')[0],
        type: 2
      };
      TOOL.alert('分享 = ' + JSON.stringify(shareDate))
      that.$http.fetch('/v1/weixin/getShareInfo/', shareDate, that, true).then(res => {
        that.$wx.config({
          appId: res.data.appId,
          timestamp: res.data.timestamp,
          nonceStr: res.data.nonceStr,
          signature: res.data.signature,
          jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone'
          ]
        });
        TOOL.setShare(
          CONFIG.ROOT + "sign.html?company_id=" + that.company_id + "&order_id=" + that.order_id,
          that.company.replace(/<br\/>/g,''),
          '请您填写手机号，开通视频彩铃',
          CONFIG.ROOT + 'wxshare.png'
        );
      })
  	},
    // 生成二维码参数
    qrcode () {
      let that = this;
      let clientWidth = document.body.clientWidth,
          width = 85;

      let qrcode = new QRCode("QRCodeNone", {
          width: width, // 二维码宽度，单位像素
          height: width, // 二维码高度，单位像素
          text: CONFIG.ROOT + "sign.html?company_id=" + that.company_id + "&order_id=" + that.order_id
        });
      var myCanvas = document.getElementsByTagName('canvas')[0];
      var qrcodeNode = document.getElementById('qrcode');
      var img = that.convertCanvasToImage(myCanvas);
      qrcodeNode.appendChild(img);

      let top = this.$refs.qrcode.getBoundingClientRect().top;
      let left = this.$refs.qrcode.getBoundingClientRect().left;

      // this.$refs.guide.style.borderTopWidth = top - 10 + "px";
      this.$refs.guide.style.borderLeftWidth = left - 8 + "px";
      // this.$refs.guide.style.top = top - 10 + "px";
      this.$refs.guideImg2.style.top = top - 141 + "px";
    },
    //将canvas返回的图片添加到image里
    convertCanvasToImage(canvas){
      var image = new Image();
      image.src = canvas.toDataURL("image/png");
      return image;
    },
    // 获取企业信息
    getCompanyInfo () {
      let that = this;

      that.$http.fetch('Company/getCompanyInfo', {
        company_id: that.GetQueryValue1('company_id')
      })
      .then(res => {
        if (res.errNo == 0) {
          let  company = '';
          if(res.data.company_name && res.data.company_name.length > 10) {
            for(let i = 0; i < res.data.company_name.length; i++) {
              if(i!= 0 && i%10 == 0) {
                company += '<br/>'
              }
              company += res.data.company_name[i]
            }
          }else {
            company = res.data.company_name
          }

          that.company = company;
          that.name = res.data.contact_name;
        }
      }) 
    }
  }
}
</script>

<style lang="scss" scoped>
#share {
  width: 100%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;

  .text {
  	text-align: center;
    font-size: 0.9rem;
  }
  .img {
    position: relative;
    text-align: center;
    height: 8.15rem;
    width: 15.85rem;
    max-width: 100%;
    margin: 0 auto;
    // margin-top: 1.45rem;
    // margin-bottom: 1.25rem;
    background-image: url("../../static/icon/share_bg.png");
    background-size: cover;
    top: 50%;
    transform: translateY(-50%);

    .title {
      position: absolute;
      top: 0.8rem;
      left: 50%;
      transform: translate(-50%, 0);
      width: 100%;
    }
    .info {
      position: absolute;
      top: 50%;
      left: 1rem;
      right: 1rem;
      transform: translate(0, -70%);
      color: #fff;
      font-size: 0.9rem;
      text-align: left;
    }
    .box {
      position: absolute;
      width: 80%;
      top: 50%;
      left: 0.6rem;
      text-align: left;
      font-size: .9rem;
      transform: translate(0, -50%);
    }
    .company {
      margin-bottom: 0.5rem;
      word-wrap:break-word;
      word-break:normal; 
    }
    .name {
      // position: absolute;
      // bottom: 1.8rem;
      // left: 0.75rem;
    }

  	#qrcode,#QRCodeNone {
  		position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
  	}
    #QRCodeNone {
      display: none;
    }
    #img {
      position: absolute;
      bottom: 1.8rem;
      right: 0.75rem;
      width: 4.25rem;
      img {
        width: 100%;
      }
    }
  }
  .buttons {
  	div {
  		display: block;
  		margin: auto;
  		margin-bottom: 1rem;
      border: none;
      padding: 0.45rem 0rem;
      background:rgba(64,173,194,1);
      border-radius:0.2rem;
      font-size: 0.8rem;
      font-weight:400;
      color:rgba(255,255,255,1);
      line-height: 1.1rem;
      margin-bottom: 0.8rem; 
      text-align: center;
  	}
    .b {
      border: 0.05rem solid rgba(64,173,194,1);
      background: #fff;
      color: #40ADC2;
    }
  }
  .guide {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100000;
    background: transparent;
    .guideInner {
      // position: fixed;
      // top: 0;
      // left: 0;
      // right: 0;
      // bottom: 0;
      // z-index: 0;
      // box-sizing: content-box;
      // width: 102px;
      // height: 102px;
      // border-color: rgba(0, 0, 0, 0.7);
      // border-style: solid;
      // border-width: 350px 1500px 1500px 238px;
      // background: transparent;
      position: absolute;
      top: 50%;
      transform: translateY(calc( -50% - 0.15rem ));
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
      box-sizing: content-box;
      width: 102px;
      height: 102px;
      border-color: rgba(0, 0, 0, 0.7);
      border-style: solid;
      border-width: 1500px 1500px 1500px 238px;
      background: transparent;
    }
    .img1 {
      position: absolute;
      top: 0.15rem;
      right: 0;
      left: 0;
      text-align: right;
      img {
        width: 66px;
        margin-right: 1.7rem;
      }
      div {
        text-align: center;
        font-size: 18px;
        color: rgba(255, 255, 255, 1);
        line-height: 20px;
      }
    }
    .img2 {
      position: absolute;
      right: 0;
      left: 0;
      text-align: right;
      img {
        width: 45px;
        margin-right: 4.6rem;
      }
      div {
        text-align: center;
        font-size: 18px;
        color: rgba(255, 255, 255, 1);
        line-height: 20px;
      }
    }

    .img3 {
      position: absolute;
      top: 75%;
      right: 0;
      left: 0;
      text-align: center;
      transform: translateY(-25%);
      img {
        width: 166px;
      }
    }
  }
}
</style>
