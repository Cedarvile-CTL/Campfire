<h2>Log in</h2>
<?php if (isset($login_error) && $login_error) : ?>
<p class="alert alert-warning">{message}</p>
<?php else : ?>
<p class="alert alert-warning">You must log in to use this application. Enter your Cedarville credentials below.</p>
<?php endif; ?>
<form action="{base_url}authenticate/login" method="post">
    <ul>
        <li class="control-group">
            <label class="control-label">Username</label>
            <div class="controls">
                <input type="text" name="username" />
            </div>
        </li>
        <li class="control-group">
            <label class="control-label">Password</label>
            <div class="controls">
                <input type="password" name="password" />
            </div>
        </li>
    </ul>
    <p><input type="submit" value="Sign in" /></p>
</form>