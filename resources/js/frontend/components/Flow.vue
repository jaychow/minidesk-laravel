
<template>
    <div class="bs-stepper" ref="stepper" id="bs-stepper">
        <div class="bs-stepper-header" role="tablist">
            <!-- your steps here -->
            <div class="step" data-target="#assess-part">
                <button type="button" class="step-trigger" role="tab" aria-controls="assess-part" id="assess-part-trigger">
                    <span class="bs-stepper-circle">ASSESS</span>
                </button>
            </div>
            <div class="line"></div>
            <div class="step" data-target="#analyze-part">
                <button type="button" class="step-trigger" role="tab" aria-controls="analyze-part" id="analyze-part-trigger">
                    <span class="bs-stepper-circle">ANALYZE</span>
                </button>
            </div>
            <div class="line"></div>
            <div class="step" data-target="#hedge-part">
                <button type="button" class="step-trigger" role="tab" aria-controls="hedge-part" id="hedge-part-trigger">
                    <span class="bs-stepper-circle">HEDGE</span>
                </button>
            </div>
            <div class="line"></div>
            <div class="step" data-target="#save-part">
                <button type="button" class="step-trigger" role="tab" aria-controls="save-part" id="save-part-trigger">
                    <span class="bs-stepper-circle">SAVE</span>
                </button>
            </div>
            <div class="line"></div>
            <div class="step" data-target="#manage-part">
                <button type="button" class="step-trigger" role="tab" aria-controls="manage-part" id="manage-part-trigger">
                    <span class="bs-stepper-circle">MANAGE</span>
                </button>
            </div>
        </div>
        <div class="bs-stepper-content">
            <!-- your steps content here -->
            <div id="assess-part" class="content" role="tabpanel" aria-labelledby="assess-part-trigger" style="display:false"></div>
            <div id="analyze-part" class="content" role="tabpanel" aria-labelledby="analyze-part-trigger" style="display:false"></div>
            <div id="hedge-part" class="content" role="tabpanel" aria-labelledby="hedge-part-trigger" style="display:false"></div>
            <div id="save-part" class="content" role="tabpanel" aria-labelledby="save-part-trigger" style="display:false"></div>
            <div id="manage-part" class="content" role="tabpanel" aria-labelledby="manage-part-trigger" style="display:false"></div>
        </div> 
    </div>

</template>
<script>
    import {mapGetters} from 'vuex'
    import Stepper from 'bs-stepper'
    export default {
        mounted() {
            this.stepper = new Stepper(this.$refs.stepper)        
        },
        data(){
            return {
                stepper: null,
                flow: "ASSESS",
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