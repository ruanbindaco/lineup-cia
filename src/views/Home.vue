<template>
  <div class="login-page">
    <div class="header">
      <h1 class="title">CIA 2024</h1>
      <p class="subtitle">Gerador de Line-up</p>
    </div>
    <div class="text">
      Descrubra sua line perfeita de acordo com seus artistas favoritos
    </div>
    <div @click="login" class="login-button">Entre com o seu spotify</div>

    <div class="actual-cia">
      <p class="cia-title">Line Original</p>
      <img
        class="img-cia"
        src="../assets/images/line-original.jpg"
        alt="Line Original"
      />
      <p>
        Não conhece a CIA? Acesse o Instagram deles clicando
        <a href="https://www.instagram.com/copainteratleticas/">aqui.</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clientId: "8f9ffdab050c4b2cb399ceda2a725638",
      scope: "user-top-read",
      redirectUrl: "http://localhost:5173/callback",
    };
  },
  methods: {
    login() {
      location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${this.clientId}&scope=${this.scope}&redirect_uri=${this.redirectUrl}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 70px;
  padding: 25px 32px;

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      font-size: 55px;
    }
    .subtitle {
      font-size: 35px;
    }
  }
  .text {
    font-size: 28px;
  }
  .login-button {
    font-size: 25px;
    padding: 21px 15px;
    border-radius: 10px;
    border: 1px solid #ccc;
    background-color: #005355;
    color: #fff;
    cursor: pointer;

    &:hover {
      background-color: #08838e;
    }
  }

  .actual-cia {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding-top: 32px;
    .cia-title {
      font-size: 40px;
    }
    .img-cia {
      max-width: 600px;
      width: 100%;
    }
  }
}
</style>
