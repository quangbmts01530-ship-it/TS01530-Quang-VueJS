<template>
    <div>
        <!-- <h1>Hiển thị nội dung ở đây</h1> -->
        <h6 v-html="content" v-bind:style="styleData" v-bind:class="className"></h6>
        <h6 class="text-red" style="font-size: 5rem">{{ content }}</h6>
        <h2>{{ message }}</h2>
        <h2 v-html="number + 5"></h2>
        <h4>{{ sayHi() }}</h4>
        <button @click="change()">Change</button>
        
    </div>
</template>
<script>
export default {
    data(){
        return {
            content: 'Xin chào các bạn',
            message: 'Xin chao VueJS',
            number: 10,
            className: 'text-red',
	        styleData: 'font-size: 5rem'
        }
    },
    methods: {
        sayHi(){
            return 'Day la phuong thuc'
        },
        changeContent(){
            this.message = 'day la noi dung moi'
        },
        change(){
            this.content = 'Da doi thanh noi dung moi'
            this.className = 'text-blue'
        }
    }
}
</script>
<style>
    .text-red{
        color: red;
    }
    .text-blue{
        color: blue;
    }
</style>