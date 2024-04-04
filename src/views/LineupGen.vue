<template>
  <div class="container">
    <div class="cia-list" ref="printMe">
      <div class="artists">
        <div v-if="artistsUser !== null" class="names">
          <div
            v-for="artist in artistsUser"
            class="singer"
            ref="artists"
            :key="artist"
          >
            <span class="artist"> {{ artist }} </span>
          </div>
          <div v-if="artistsUser == null">
            Parece que você não possui artistas :(
          </div>
        </div>
      </div>
    </div>
    <div @click="downloadLineup" class="download">Download button</div>
  </div>
</template>

<script>
import axios from "axios";
import fileSaver from "file-saver";
export default {
  components: {
    fileSaver,
  },
  data() {
    return {
      accessToken: null,
      user: {},
      artistsUser: null,
      output: null,
    };
  },
  async mounted() {
    let clientId = "8f9ffdab050c4b2cb399ceda2a725638";
    let clientSecret = "6ba5805874214c0b924939a0a34cd956";
    let params = new URLSearchParams(document.location.search);
    let code = params.get("code");

    let body = {
      grant_type: "authorization_code",
      code,
      redirect_uri: "https://lineup-cia-2024.vercel.app/callback",
    };

    let response = await axios({
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      data: new URLSearchParams(Object.entries(body)).toString(),
      headers: {
        Authorization: `Basic ${btoa(clientId + ":" + clientSecret)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    this.accessToken = response.data.access_token;

    let userResponse = await axios({
      method: "GET",
      url: "https://api.spotify.com/v1/me",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    this.user = {
      name: userResponse.data.display_name,
      id: userResponse.data.id,
    };

    let artists = await axios({
      method: "GET",
      url: "https://api.spotify.com/v1/me/top/artists?limit=25",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    let artistsTest = [];
    artists.data.items.map((artist) => {
      artistsTest.push(artist.name);
    });
    this.artistsUser = artistsTest;
  },
  methods: {
    async downloadLineup() {
      const el = this.$refs.printMe;
      const options = {
        type: "dataURL",
      };
      fileSaver.saveAs(await this.$html2canvas(el, options));
    },
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap");
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  .cia-list {
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("../assets/images/background-cia-2024.png");
    background-size: cover;
    background-position: center;
    max-width: 500px;
    width: 100%;
    height: 900px;

    .artists {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 30px;
      flex-direction: column;
      height: 100%;
      width: 100%;

      .names {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 3px;
        text-align: justify;
        font-size: 20px;
        color: #fff;
        width: 475px;
        padding-top: 125px;

        .singer {
          width: fit-content;
          font-family: "Alegreya", serif;
          font-weight: 500;

          &:after {
            padding-right: 4px;
            content: " \2022 ";
          }

          &:last-child::after {
            content: "";
          }
        }
      }

      .link {
        display: flex;
        justify-content: center;
        text-align: justify;
        font-size: 20px;
        color: #fff;
      }
    }
  }
  .download {
    padding: 8px 16px;
    background-color: rgba(0, 81, 88, 255);
    color: #fff;
    text-decoration: none;
    cursor: pointer;
    border-radius: 10px;

    &:hover {
      background-color: #08838e;
    }
  }
}

@media (max-width: 530px) {
  .container {
    .cia-list {
      background-size: contain;
      background-repeat: no-repeat;

      .artists {
        gap: 20px;
        .names {
          font-size: 16px;
          width: 85%;
          padding-top: 100px;
        }

        .link {
          font-size: 10px;
        }
      }
    }
  }
}

@media (max-width: 400px) {
  .container .cia-list .artists {
    .names {
      font-size: 14px;
    }
  }
}
</style>
