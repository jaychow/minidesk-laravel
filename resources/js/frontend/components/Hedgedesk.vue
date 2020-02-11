<template>
    <div id="Hedgedesk">
        <nav class="navbar navbar-expand-lg mx-auto flow">
            <router-link to='Assess' class="router-button" tag="button">
                Assess
            </router-link >
            <span class="col border my-auto"></span>
            <router-link to='Analyze' class="router-button" tag="button">
                <div>Analyze</div>
            </router-link>
            <span class="col border my-auto"></span>
            <router-link to='Hedge' class="router-button" tag="button">
                <div>Hedge</div>
            </router-link>
            <span class="col border my-auto"></span>
            <router-link to='Save' class="router-button" tag="button">
                <div>Save</div>
            </router-link>
            <span class="col border my-auto"></span>
            <router-link to='Manage' class="router-button" tag="button">
                <div>Manage</div>
            </router-link>
        </nav>
        <div class="router-content"><router-view/></div>
    </div>
</template>
