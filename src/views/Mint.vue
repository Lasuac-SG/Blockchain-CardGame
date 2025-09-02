<template>
  <div class="mint-page">
    <h2>铸造卡牌</h2>
    <div class="balance">当前余额: {{ balance }} GoCoin</div>

    <form @submit.prevent="handleMint" class="mint-form">
      <label>
        卡牌名字：
        <input v-model="form.name" type="text" required />
      </label>

      <label>
        描述：
        <textarea v-model="form.profile" required></textarea>
      </label>

      <label>
        卡牌图片：
        <input type="file" accept="image/*" @change="handleFileChange" required />
      </label>

      <button type="submit">铸造</button>
    </form>

    <!-- 调用封装的卡牌弹窗 -->
    <CardModal :visible="showModal" :card="newCard" @close="showModal = false" />
  </div>
</template>

<script>
import { request } from "../api/request"
import { getProfile } from "../api/auth"
import CardModal from "../components/CardModal.vue"

export default {
  name: "Mint",
  components: { CardModal },
  data() {
    return {
      balance: 0,
      form: { name: "", profile: "", avatar: "" },
      newCard: {},
      showModal: false
    }
  },
  async mounted() {
    await this.fetchBalance()
  },
  methods: {
    async fetchBalance() {
      try {
        const res = await getProfile()
        if (res.code === 200) {
          this.balance = res.data.gocoin
        } else {
          alert("获取余额失败")
        }
      } catch (e) {
        console.error(e)
      }
    },
    handleFileChange(e) {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.form.avatar = reader.result
      }
    },
    async handleMint() {
      if (!this.form.name || !this.form.profile || !this.form.avatar) {
        alert("请填写完整信息")
        return
      }

      try {
        const payload = {
          name: this.form.name,
          profile: this.form.profile,
          data: this.form.avatar
        }

        const res = await request("/auth/card/mint", {
          method: "POST",
          body: JSON.stringify(payload)
        })

        if (res.code === 200) {
          this.newCard = res.data
          this.balance -= 10
          this.showModal = true
          this.form = { name: "", profile: "", avatar: "" }
        } else {
          alert(res.msg || "铸造失败")
        }
      } catch (e) {
        console.error("铸造失败", e)
        alert("服务器错误")
      }
    }
  }
}
</script>

<style scoped>
.mint-page {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
}

h2 {
  margin-bottom: 1rem;
  color: #1e3a8a;
}

.balance {
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.mint-form label {
  display: block;
  margin-bottom: 1rem;
  text-align: left;
}

.mint-form input,
.mint-form textarea {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.mint-form button {
  padding: 0.8rem 1.2rem;
  background-color: #42b983;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.mint-form button:hover {
  background-color: #369870;
}
</style>
