<template>
    <div class="info-list-container" >
        <PreviousButton/>
        <div class="transfer-type-container recurring-transfer">
            <div class="transfer-title">
                RECURRING TRANSFERS SET
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import PreviousButton from "../PreviousButton"
export default {
    name: "recurring-set",
    components: {
        PreviousButton
    },
}
</script>