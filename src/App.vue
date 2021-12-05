<template>
  <div id="app">
    <TabHead/>
    <router-view />
  </div>
</template>

<script>
  import TabHead from "./components/tabHead.vue"
  
  export default({
  components: {
    TabHead
  }
})
</script>


<style>
  @import './assets/css/iconfont.css';
</style>
<style lang="scss">
canvas.canvas {
  position: relative !important;
  top: 0px !important;
}

.ba {
  user-select: none;
 -webkit-user-select: none;
 -webkit-tap-highlight-color: transparent; 
  -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
  border-color:transparent !important;
  }
.ba:focus {
  outline:0;
}
.www {
  font-size: 0.7rem;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(51,51,51,1);
  line-height: 1rem;
}
html{
  font-size: 20px;
  font-family: 'PingFangSC-Regular','PingFang SC';

  *{
    margin: 0;
    padding: 0;
  }

  &,body,#app{
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100%;
    letter-spacing: 0.05rem;
  }

  .el-table .cell {
    padding: 0px !important;
  }
  th:first-child {
    padding-left: 0.75rem;
  }
  th:last-child {
    padding-right: 0.75rem;
  }
  td:first-child {
    padding-left: 0.75rem;
  }
  td:last-child {
    padding-right: 0.75rem;
  }

  .el-input__inner:focus {
    outline: none !important;
    -webkit-appearance: none !important;
    -webkit-tap-highlight-color:rgba(0,0,0,0) !important;
  }
  button, .el-input__inner {
    -webkit-appearance: none !important;
    -webkit-tap-highlight-color:rgba(0,0,0,0) !important;
  }

  #account {
    .number>input::-webkit-input-placeholder {
      font-size: 0.7rem;
      line-height: 1rem;
    }

    .number>input::-moz-placeholder {
      font-size: 0.7rem;
      line-height: 1rem;
    }

    .number>input:-ms-input-placeholder {
      font-size: 0.7rem;
      line-height: 1rem;
    }

    .number>input:-moz-placeholder {
      font-size: 0.7rem;
      line-height: 1rem;
    }
  }
  #share {
    padding: 1.45rem !important;
  }
  #sign,
  #account,
  #pay,
  #payment,
  #protocol,
  #share {
    position: relative;
    height: 100%;
    padding: 2rem 1.6rem 1rem 1.6rem;
    box-sizing: border-box;
    overflow: auto;

    .vessel {
      position: absolute;
      top: 3.5rem;
      height: calc( 100vh - 7rem );
      width: calc( 100% - 1rem );
      box-sizing: border-box;
      margin: auto;
      padding: 1.25rem 0.75rem;
      background-color: rgba(242,242,242,0.4);
    }
  }

  #sign,
  #account,
  #pay {
    // background-image: url('../static/icon/background.png');
    // background-size: cover;
  }

  #qrcode img {
    margin: auto;
  }
  .el-message-box {
    width: 90% !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .el-message {
    min-width: 100%;
    width: 100%;
  }

  #sign {
    .el-dialog__body {
      height: 50vh;
    }
    .el-form-item__label {
      padding: 0rem;
      text-align: left;
      font-size: 0.7rem;
      letter-spacing: 0.02rem;
    }
    .el-input__inner {
      border: none;
      padding: 0.6rem 0.75rem;
      height: 2.2rem;
      color: #333333;
      font-size: 0.7rem;
      line-height: normal;
      letter-spacing: 0.05rem;

      background: rgba(242,242,242,1);
      border-radius: 0.2rem;

      &::-webkit-input-placeholder {
        color: #999999;
        line-height: normal;
      }
      &::-moz-placeholder {
        color: #999999;
      }
      &::-ms-input-placeholder {
        color: #999999;
      }
    }
    .el-checkbox__inner {
      border-radius: 50%;
      background: none;
    }
    .el-form-item__content {
      margin-left: 0rem !important;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      border-color: #79d4e4;
      background: #79d4e4 !important;
    }
    .el-input .el-input__count .el-input__count-inner {
      background: none;
      color: #fff;
    }
    .el-input__count-inner {
      color: #999999;
    }
    .el-checkbox__label {
      font-size: 0.6rem;
      color: #999999;
      padding-left: 0.3rem;
    }
    .el-checkbox__input.is-checked+.el-checkbox__label{
      color: #333333;
    }
    .el-checkbox__input.is-focus .el-checkbox__inner {
      border-color: #DCDFE6;
    }
  }

  #account {
    .el-radio__input {
      display: none;
    }
    .el-input__inner {
      padding-left: 0.5rem;
      background: none;
      color: #333333;
      font-size: 0.7rem;
      line-height: 0.7rem;
      height: 2.2rem;
      border-radius: 0.2rem;
      border: 0.05rem solid rgba(121,212,228,1);

      &::-webkit-input-placeholder {
        color: #999999;
      }
      &::-moz-placeholder {
        color: #999999;
      }
      &::-ms-input-placeholder {
        color: #999999;
      }
    }
    .el-radio.is-bordered {
      width: 31%;
      margin: 0rem;
      margin-bottom: 0.75rem;
      height: 2.4rem;
      line-height: 2.4rem;
      float: left;
      padding: 0rem;
      background: rgba(242,242,242,1);
      border: none;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      -webkit-tap-highlight-color: transparent;

      &:not(:last-child) {
        margin-right: 3.33%;
      }
      &.is-checked {
        background: #79D4E4 !important;
        border-color: #79D4E4 !important;

        .el-radio__label {
          color: #fff;
          font-weight: bold;
        }
      }

      .el-radio__label {
        padding: 0rem;
      }
    }
  }
  #payment {
    .el-table__row {
      td div{
        font-size: 0.8rem;
        font-weight: 400;
      }
    }
    .el-button.is-round {
      padding: 0 !important;
    }
    .el-table .cell {
      padding-right: 1.25rem;
      padding-left: 1.25rem;
      font-size: 0.8rem;
    }
    .el-table th>.cell {
      font-size: 0.8rem;
      color: #333;
    }
    .el-table .phone .cell {
      padding: 0rem !important;
    }
    .el-table .gray-row {
      background: rgba(242,242,242,1);
    }
    .el-button{
      border: none;
    }
  }
}
</style>
