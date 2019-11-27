
<template>
    <div class="bs-stepper" ref="stepper" id="bs-stepper">
        <div class="bs-stepper-header" role="tablist">
            <!-- your steps here -->
            <div class="step" data-target="#assess-part">
                <button type="button" class="step-trigger" role="tab" aria-controls="assess-part" id="assess-part-trigger" 
                @click="setFlow">
                    <span class="bs-stepper-circle">ASSESS</span>
                </button>
            </div>
            <div class="line"></div>
            <div class="step" data-target="#analyze-part">
                <button type="button" class="step-trigger" role="tab" aria-controls="analyze-part" id="analyze-part-trigger"
                @click="setFlow">
                    <span class="bs-stepper-circle">ANALYZE</span>
                </button>
            </div>
            <div class="line"></div>
            <div class="step" data-target="#hedge-part">
                <button type="button" class="step-trigger" role="tab" aria-controls="hedge-part" id="hedge-part-trigger"
                @click="setFlow">
                    <span class="bs-stepper-circle">HEDGE</span>
                </button>
            </div>
            <div class="line"></div>
            <div class="step" data-target="#save-part">
                <button type="button" class="step-trigger" role="tab" aria-controls="save-part" id="save-part-trigger"
                @click="setFlow">
                    <span class="bs-stepper-circle">SAVE</span>
                </button>
            </div>
            <div class="line"></div>
            <div class="step" data-target="#manage-part">
                <button type="button" class="step-trigger" role="tab" aria-controls="manage-part" id="manage-part-trigger"
                @click="setFlow">
                    <span class="bs-stepper-circle">MANAGE</span>
                </button>
            </div>
        </div>
        <div class="bs-stepper-content">
            <!-- your steps content here -->
            <!-- <div id="assess-part" class="content" role="tabpanel" aria-labelledby="assess-part-trigger" style="display:false"></div> -->
            <div id="assess-part" class="content" role="tabpanel" aria-labelledby="assess-part-trigger">  
                <FlowAccess></FlowAccess>
            </div>
            <div id="analyze-part" class="content" role="tabpanel" aria-labelledby="analyze-part-trigger">
                ANALYZE-PAGE-CONTENT 
            </div>
            <div id="hedge-part" class="content" role="tabpanel" aria-labelledby="hedge-part-trigger">
                HEDGE-PAGE-CONTENT                
            </div>
            <div id="save-part" class="content" role="tabpanel" aria-labelledby="save-part-trigger">
                SAVE-PAGE-CONTENT
            </div>
            <div id="manage-part" class="content" role="tabpanel" aria-labelledby="manage-part-trigger">
                MANAGE-PAGE-CONTENT
            </div>
        </div> 
    </div>

</template>
<script>
    import {mapGetters} from 'vuex'
    import Stepper from 'bs-stepper'
    import MainChart from "./Chart/MainChart"
    import FlowAccess from "./FlowAccess"

    export default {
        components: {
            MainChart,
            FlowAccess
        },
        mounted() {
            this.stepper = new Stepper(this.$refs.stepper)  
        },
        data(){
            return {
                stepper: null,
                // flow: "ASSESS",

                debug_index: 1,
            }
        },
        methods:{
            setFlow: function(){
                var f = this.flow
                f.subflow = 0
                this.$store.dispatch('setFlow', f)
            }
        },
        computed: {
            ...mapGetters(['flow']),
        },
        watch: {
            flow: {  
                handler(val){
                    const stepList = ['ASSESS', 'ANALYZE', 'HEDGE', 'SAVE', 'MANAGE']
                    try {
                        var index = stepList.indexOf(val.type)
                        this.stepper.to(index+1)
                    } catch (error) {
                        console.log(error)
                        this.stepper.to(1)
                    }
                },
                deep: true,
            }
        }
    }
</script>>