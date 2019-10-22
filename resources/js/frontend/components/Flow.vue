
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
                <div class="minidesk-bottom" aria-labelledby="logins-part-trigger">
                    <div class="chart-container" id="chart-container">
                        <div class="top-area">
                            <ChartHeader></ChartHeader>
                        </div>
                        <div class="chart-body">
                            <Chart></Chart>
                        </div>
                        <div class="bottom-area">
                            <ChartFooter></ChartFooter>
                        </div>
                    </div>
                    <div id="user-panel">
                        <Sidebar></Sidebar>
                    </div>
                </div>
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

    import ChartHeader from "./Chart/Header"
    import Chart from "./Chart/Chart"
    import Sidebar from "./Sidebar"
    import ChartFooter from "./Chart/Footer"
    import InfoPage from "./InfoPage"

    export default {
        components: {
            ChartHeader,
            Chart,
            Sidebar,
            ChartFooter,
            InfoPage
        },
        mounted() {
            this.stepper = new Stepper(this.$refs.stepper)  
        },
        data(){
            return {
                stepper: null,
                flow: "ASSESS",

                debug_index: 1,
            }
        },
        methods:{
            setFlow: function(){
                if(this.debug_index <= 5)
                    this.debug_index += 1
                else
                    this.debug_index = 1
                this.stepper.to(this.debug_index)
            }
        },
        computed: {
            // ...mapGetters(['flow']),
        },
        watch: {
            flow(){
                const stepList = ['ASSESS', 'ANALYZE', 'HEDGE', 'SAVE', 'MANAGE']
                try {
                    let index = stepList.indexOf(this.flow)
                    this.stepper.to(index+1)
                } catch (error) {
                    console.log(error)
                    this.stepper.to(1)
                }
                
            }
        }
    }
</script>>