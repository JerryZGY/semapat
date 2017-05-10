<template>
  <div class="home">
    <div class="field" :class="{'animated': data.length}">
      <img src="../assets/favicon.png">
      <h1>SemaPat</h1>
      <b-form-input @keyup.enter="submit($event.target)" class="search" type="text" placeholder="Search the kind of products" />
    </div>
    <div v-if="data.length" class="row">
      <b-table striped hover :items="data" :fields="fields">
        <template slot="product" scope="item">
          <b-button :variant="'outline-primary'" @click="details(item.value)">
            &lt;{{item.value}}&gt;
          </b-button>
        </template>
        <template slot="specs" scope="item">
          <b-button v-for="spec in item.value" :key="spec" :variant="'outline-success'" @click="details(spec)">
            &lt;{{spec}}&gt;
          </b-button>
        </template>
        <template slot="patents" scope="item">
          <b-button v-for="patent in item.value" :key="patent" :variant="'outline-success'" @click="details(patent)">
            &lt;{{patent}}&gt;
          </b-button>
        </template>
        <template slot="imgs" scope="item">
          <div class="img" v-for="img in item.value" v-bind:style="{ backgroundImage: 'url(' + img + ')' }"></div>
        </template>
      </b-table>
    </div>
    <b-modal id="modal1" title="Details" :hide-footer="true" :hide-header-close="true">
      <div v-if="dataDetails.length" class="row">
        <b-table striped hover :items="dataDetails" :fields="fieldsDetails">
          <template slot="key" scope="item">
            <b-button :variant="'outline-primary'">
              &lt;{{item.value}}&gt;
            </b-button>
          </template>
          <template slot="value" scope="item">
            <b-button v-if="item.value.match(/^http.*webpat/)" :variant="'outline-success'" @click="webpat(item.value)">
              &lt;Webpat 專利檢索&gt;
            </b-button>
            <b-button v-else :variant="'outline-success'">
              &lt;{{item.value}}&gt;
            </b-button>
          </template>
        </b-table>
      </div>
    </b-modal>
    <transition name="fade">
      <div v-if="loading" class="spinner-container">
        <spinner></spinner>
      </div>
    </transition>
    <b-alert :show="dismissCountDown" variant="danger" @dismiss-count-down="countDownChanged">
      Your search did not match any products.
    </b-alert>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import Component from 'vue-class-component';
import Spinner from './spinner.vue';

@Component({
  components: {
    Spinner
  }
})
export default class Home extends Vue {
  data = [];
  dataDetails = [];
  dismissCountDown = null;
  loading = false;
  fields = {
    product: {
      label: 'Linked',
      sortable: true
    },
    name: {
      label: 'Name',
      class: 'name-container'
    },
    specs: {
      label: 'Specs',
      class: 'patents-container'
    },
    patents: {
      label: 'Patents',
      class: 'patents-container'
    },
    imgs: {
      label: 'Imgs',
      class: 'imgs-container'
    }
  };
  fieldsDetails = {
    key: {
      label: 'Linked'
    },
    value: {
      label: 'Object'
    }
  };

  showAlert() {
    this.dismissCountDown = 3;
  }

  countDownChanged(dismissCountDown) {
    this.dismissCountDown = dismissCountDown;
  }

  webpat(url) {
    window.open(url);
    // this.$router.replace(url);
  }

  async submit(target) {
    target.blur();
    this.loading = true;
    const { data } = await axios.post('/api/search', { kind: target.value });
    setTimeout(() => {
      this.loading = false;
      this.data = data;
      if (data && !data.length) {
        this.showAlert();
      }
    }, 1000);
  }

  async details(subject) {
    this.loading = true;
    const { data } = await axios.post('/api/details', { subject });
    setTimeout(() => {
      this.loading = false;
      this.dataDetails = data;
      this.$root.$emit('show::modal', 'modal1');
    }, 1000);
  }
}
</script>

<style lang="scss">
.home {
  display: table;
  width: 100%;
  height: inherit;
  .field {
    height: 200px;
    width: 250px;
    margin: auto;
    transform: translateY(250px);
    transition: transform .6s cubic-bezier(0.19, 1, 0.22, 1);
  }
  .row {
    margin: auto;
  }
  .name-container {
    min-width: 265px;
  }
  .patents-container>button {
    margin: auto 5px;
  }
  .imgs-container {
    min-width: 245px;
    .img {
      display: inline-block;
      border: 2px solid #ddd;
      border-radius: 10px;
      width: 100px;
      height: 100px;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      margin: auto 5px;
    }
  }
  .modal-dialog {
    margin: 30px;
    max-width: none;
  }
  th {
    text-align: center;
  }
  td {
    vertical-align: middle !important;
  }
  img {
    width: 100px;
    height: 100px;
  }
  .spinner-container {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    margin: auto;
    display: table;
    z-index: 1050;
    position: fixed;
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.5);
    .spinner {
      margin: auto;
      display: table-cell;
      transform: scale(1.5);
      vertical-align: middle;
      .spinner-inner {
        margin: auto;
      }
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .8s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .animated {
    transform: translateY(0);
  }
}
</style>