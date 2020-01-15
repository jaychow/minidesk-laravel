<template>
    <div class="previous-button">
        <button class="submitButton submit-previous" @click="previousFlow()">&#8249;</button>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    name: "previous-button",
    data(){
        return {

        }
    },
    methods: {
        previousFlow(){
            var f = this.flow
            if(f.subflow >= 1){
                switch (f.subflow) {
                    case 5:
                        f.subflow = 2
                        break
                    case 6:
                        f.subflow = 2
                        break
                    case 8:
                        f.subflow = 6
                        break
                    case 9:
                        f.subflow = 4
                        break
                    default:
                        f.subflow = f.subflow - 1
                        break
                }
                this.$store.dispatch('setFlow', f)
            }
        }
    },
    computed: {
        ...mapGetters(['flow']),
    }
}
</script>