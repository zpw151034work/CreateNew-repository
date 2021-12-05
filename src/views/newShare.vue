<template>
  <div id="newShare">
  	<div class="img">
  		<div class="d">
  			<div id="name">{{name}}</div>
	  		<div id="company">{{company}}</div>
	  		<div id="company1">{{company1}}</div>
	  		<div id="marke">{{marke[1]}}</div>
  		</div>
      <!-- <div class="box">
      	<div class="title">邀请卡</div>
        <div class="name">{{name}}</div>
        <div class="company" v-html="company"></div>
      </div>
      <div id="QRCodeNone"></div>
      <a id="img" href="javascript:void(0);" v-if="isIOS">
        <div id="qrcode" ref="qrcode"></div>
      </a>
      <div id="img" v-if="!isIOS">
        <div id="qrcode" ref="qrcode"></div>
      </div>
  		<div class="marke">{{marke[1]}}</div> -->
  		<div class="marke fix">{{marke[0]}}</div>
	    <vue-canvas-poster :widthPixels="311" :painting="painting" @success="success" @fail="fail"></vue-canvas-poster>
  		<a id="img" href="javascript:void(0);" v-if="isIOS && base">
	    	<img :src="base">
	    </a>
	    <div id="img" v-if="!isIOS && base">
        <img :src="base">
      </div>
  	</div>
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
    this.getCompanyInfo();
  },
  mounted() {
    this.$nextTick(() => {
      // this.qrcode();
      this.custom();
    });
  },
  data () {
  	return {
  		code: '',
      isIOS: true,
      name: '',
      company: '',
      company1: '',
      isWx: false,
      company_id: 0,
      order_id: 0,
      marke: [
      	'长按二维码保存到相册或分享链接，\r\n分享给员工填写信息。',
      	'邀请您开通企业视频彩铃'
      ],
      painting: false,
      base: false
  	}
  },
  methods: {
    success(src) {
     	this.base = src;
    },
    fail(err) {
      console.log('fail', err)
    },
    initCanvas() {
    	let that = this,
    			imgBox = document.getElementsByClassName('img')[0],
    			name = document.getElementById('name'),
    			com = document.getElementById('company'),
    			com1 = document.getElementById('company1'),
    			marke = document.getElementById('marke'),
    			width = imgBox.offsetWidth,
    			height = imgBox.offsetHeight;

    	let painting = {
        width: width + 'px',
        height: height + 'px',
        borderRadius: '20px',
        views: [
          {
            type: 'image',
            url: require('../assets/img/shareBackground.png'),
            css: {
              top: '0px',
              left: '0px',
              width: '311px',
              height: '502px'
            }
          },
          {
			      type: 'rect',
			      css: {
			        top: '212px',
			        left: '56px',
			        color: '#ACE7F2',
			        width: '200px',
          		height: '200px'
			      }
          },
          {
			      type: 'rect',
			      css: {
			        top: '214px',
			        left: '58px',
			        color: '#fff',
			        width: '196px',
          		height: '196px'
			      }
          },
          {
			      type: 'qrcode',
			      content: CONFIG.ROOT + "sign.html?company_id=" + that.company_id + "&order_id=" + that.order_id,
			      css: {
			        top: '222px',
			        left: '66px',
			        color: '#000',
			        width: '180px',
			        height: '180px'
			      }
          },
          {
			      type: 'text',
			      text: '邀请卡',
			      css: {
			        top: '39px',
			        left: '87px',
			        color: '#1757A2',
			        fontWeight: '400',
          		fontSize: '46px',
          		textShadow: '0px 1px 0px rgba(23,87,162,1)'
			      }
          },
          {
			      type: 'text',
			      text: '邀请卡',
			      css: {
			        top: '37px',
			        left: '87px',
			        color: '#79D4E4',
			        fontWeight: '400',
          		fontSize: '46px',
          		textShadow: '0px 1px 0px rgba(23,87,162,1)'
			      }
          },
          {
			      type: 'rect',
			      css: {
			        top: '97px',
			        left: '76px',
			        color: '#79D4E4',
			        width: '160px',
          		height: '2px'
			      }
          },
          {
			      type: 'text',
			      text: that.name,
			      css: {
			        top: '130px',
			        width: '231px',
			        left: '40px',
			        textAlign: 'center',
			        color: '#212121',
			        fontWeight: '400',
          		fontSize: '22px'
			      }
          },
          {
			      type: 'text',
			      text: that.company,
			      css: {
			        top: '170px',
			        width: '297px',
			        left: '7px',
			        textAlign: 'center',
			        color: '#212121',
			        fontWeight: '400',
	        		fontSize: '16px'
			      }
	        },
          {
			      type: 'text',
			      text: that.marke[1],
			      css: {
			        top: '432px',
			        width: '231px',
			        left: '40px',
			        textAlign: 'center',
			        color: '#757575',
			        fontWeight: '400',
          		fontSize: '14px'
			      }
          },
        ]
      };

      that.painting = painting;
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
      	// alert(JSON.stringify(res.data))
        that.$wx.config({
          // debug: true,
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
      		imgBox = document.getElementById('img'),
          width = imgBox.offsetWidth - 24;

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

      // // this.$refs.guide.style.borderTopWidth = top - 10 + "px";
      // this.$refs.guide.style.borderLeftWidth = left - 8 + "px";
      // // this.$refs.guide.style.top = top - 10 + "px";
      // this.$refs.guideImg2.style.top = top - 141 + "px";
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
          let company = res.data.company_name;

          that.company = company;
          that.name = res.data.contact_name;

        	that.initCanvas();
        }
      }) 
    }
  }
}
</script>

<style lang="scss" scoped>
#newShare {
	background:linear-gradient(180deg,rgba(2,68,92,1) 0%,rgba(2,15,23,1) 100%);
	height: calc( 100vh - 2rem );
	padding: 1rem 0;
	padding-top: 2rem;
	width: 100%;
	position: relative;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;

	#QRCodeNone{
		display: none;
	}
	.img {
		// background: url('../assets/img/shareBackground.png');
    background-size: cover;
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 10;
    transform: translate(-50%, -48%);
    width: 311px;
    height: 502px;

    .d {
    	position: absolute;
	    top: 50%;
	    left: 50%;
	    z-index: 0;

	    div {
	    	display: inline;
	    }
    }
    .title {
    	white-space:nowrap;
			font-size: 3.2rem;
			font-family: PingFang-SC-Regular,PingFang-SC;
			font-weight: 400;
			color: rgba(121,212,228,1);
			line-height: 3.2rem;
			letter-spacing: 1px;
			text-shadow: 0px 1px 0px rgba(23,87,162,1);
			padding: 0rem 0.45rem;
			padding-bottom: 1rem;
			border-bottom: solid 2px #ACE7F2;
	    position: absolute;
	    top: 1.75rem;
	    left: 50%;
	    transform: translate(-50%, 0);
    }
    .name {
	    position: absolute;
	    top: 6.5rem;
	    left: 50%;
	    transform: translate(-50%, 0);
	    font-size: 1.1rem;
    	width: 88%;
    	text-align: center;
    }
    .company {
	    position: absolute;
	    top: 8.5rem;
	    left: 50%;
	    transform: translate(-50%, 0);
    	font-size: 0.8rem;
    	width: 88%;
    	text-align: center;
    }
    .marke {
	    position: absolute;
	    bottom: 1.5rem;
	    left: 50%;
	    transform: translate(-50%, 0);
    	font-size: 0.8rem;
    	width: 88%;
    	color: #757575;
    	text-align: center;
    }
    .fix {
	    position: absolute;
	    bottom: 1.5rem;
	    left: 50%;
	    transform: translate(-50%, 0);
    	font-size: 0.8rem;
    	width: 88%;
    	color: #757575;
    	text-align: center;
    	background: #fff;
    	z-index: 30;
    }
	}
	#img {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0px;
		left: 0px;
		z-index: 20;
	}
}
</style>
