<template>
  <div class="container">
    <div class="cia-list" ref="printMe">
      <div class="link-lineup">https://lineup-cia-2024.vercel.app</div>
      <div class="artists">
        <div v-if="artistsUser !== null && !loading" class="names">
          <div
            v-for="artist in filteredArtists"
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
        <div v-else class="loading">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
              opacity=".25"
            />
            <path
              d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
              class="spinner_ajPY"
            />
          </svg>
        </div>
      </div>
    </div>
    <div v-if="device === 'desktop'" @click="downloadLineup" class="download">
      Download
    </div>
    <div v-else class="mobile-share">
      <span>Primeiro tire um print</span>
      <span>Click aqui para compartilhar no story do instagram</span>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import fileSaver from "file-saver";
import LoadingIcon from "../assets/icons/loading-icon.svg";

export default {
  components: {
    fileSaver,
    LoadingIcon,
  },
  data() {
    return {
      accessToken: null,
      user: {},
      artistsUser: null,
      output: null,
      loading: true,
      device:
        window.innerWidth > 768
          ? "desktop"
          : window.innerWidth > 480 && window.innerWidth <= 768
          ? "tablet"
          : "mobile",
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
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

    await axios({
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      data: new URLSearchParams(Object.entries(body)).toString(),
      headers: {
        Authorization: `Basic ${btoa(clientId + ":" + clientSecret)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        if (res) this.loading = false;
        this.accessToken = res.data.access_token;
      })
      .catch((error) => {
        window.location = "https://lineup-cia-2024.vercel.app";
      });

    const userResponse = await axios({
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

    const artists = await axios({
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
    handleResize() {
      this.device =
        window.innerWidth > 768
          ? "desktop"
          : window.innerWidth > 480 && window.innerWidth <= 768
          ? "tablet"
          : "mobile";
    },
    async downloadLineup() {
      const el = this.$refs.printMe;
      const options = {
        type: "dataURL",
      };
      fileSaver.saveAs(await this.$html2canvas(el, options));
    },
  },
  computed: {
    filteredArtists() {
      return this.artistsUser.sort((a, b) => {
        const strA = a.toLowerCase();
        const strB = b.toLowerCase();

        if (strA < strB) {
          return -1;
        }

        if (strA > strB) {
          return 1;
        }

        if (isNaN(Number(strA)) || isNaN(Number(strB))) {
          return 0;
        }

        const numA = parseInt(strA);
        const numB = parseInt(strB);

        return numA - numB;
      });
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
  transform: scale(0.9);

  .cia-list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: url("../assets/images/background-cia-2024.png");
    background-size: cover;
    background-position: center;
    max-width: 500px;
    width: 100%;
    height: 900px;

    .link-lineup {
      display: flex;
      font-size: 20px;
      font-weight: 600;
      justify-content: center;
      background: rgb(255, 255, 255, 0.9);
      width: 100%;
    }

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

    .loading {
      margin-top: 20px;
      width: 60px;
      height: 60px;
      transform-origin: center;
      animation: spinner_AtaB 0.75s infinite linear;
      path {
        fill: #fff;
      }
    }
    @keyframes spinner_AtaB {
      100% {
        transform: rotate(360deg);
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

  .mobile-share {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
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
