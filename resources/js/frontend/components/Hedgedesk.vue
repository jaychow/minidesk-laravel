<template>
<div id="Hedgedesk">
    <nav class="navbar navbar-light navbar-expand-md bg-faded justify-content-center">
        <a href="/" class="navbar-brand d-flex w-50 mr-auto">Hedgedesk</a>
        <button class="navbar-toggler ml-auto custom-toggler" type="button" data-toggle="collapse" data-target="#collapsingNavbar3">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-collapse collapse w-100" id="collapsingNavbar3">
            <ul class="navbar-nav w-100 justify-content-center">
                <router-link class="stepper-button nav-item" to='Assess' tag="button">
                    <li>Assess</li>
                </router-link>

                <span class="col border my-auto stepper-border"></span>

                <router-link class="stepper-button nav-item" to='Analyze' tag="button">
                    <li>Analyze</li>
                </router-link>

                <span class="col border my-auto stepper-border"></span>

                <router-link class="stepper-button nav-item" to='Hedge' tag="button">
                    <li>Hedge</li>
                </router-link>

                <span class="col border my-auto stepper-border"></span>

                <router-link class="stepper-button nav-item" to='Save' tag="button">
                    <li>Save</li>
                </router-link>

                <span class="col border my-auto stepper-border"></span>
                <router-link class="stepper-button nav-item" to='Manage' tag="button">
                    <li>Manage</li>
                </router-link>
            </ul>
            <ul class="login-link navbar-nav mr-auto w-100 justify-content-end">
                <li class="nav-item">
                    <button class="stepper-button nav-item">Login/Register</button>
                </li>
            </ul>
        </div>
    </nav>
    <div class="stepper-content"><router-view/></div>
</div>
</template>
<script>
export default {

}
</script>
