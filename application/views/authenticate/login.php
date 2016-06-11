<div class="container">
    <h2>Log in</h2>
    <div class="card-panel teal">
    <?php if (isset($login_error) && $login_error) : ?>
        <p class="white-text">{message}</p>
    <?php else : ?>
        <p class="white-text">You must log in to use this application. Enter your Cedarville University credentials below.</p>
    <?php endif; ?>
    </div>
    <form action="{base_url}authenticate/login?ref={referral}" method="post">
        <ul>
            <li class="row">
                <div class="input-field col s12">
                    <input id="username" name="username" type="text" class="validate">
                    <label for="username">Cedarville username</label>
                </div>
            </li>
            <li class="row">
                <div class="input-field col s12">
                    <input id="password" name="password" type="password" class="validate">
                    <label for="password">Cedarville password</label>
                </div>
            </li>
        </ul>
        <p><button type="submit" class="waves-effect waves-light btn">Sign in</button></p>
    </form>
</div>