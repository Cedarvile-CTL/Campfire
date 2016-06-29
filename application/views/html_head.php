<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>{page_title}</title>
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/css/materialize.min.css" />
<!--          href="{base_url}assets/materialize.min.css" />-->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    <link type="text/css" rel="stylesheet" href="{base_url}assets/base.css" />
</head>
<body ng-app="campfire-client">
    <nav class="row">
        <div class="nav-wrapper">
            <div class="col s12">
                <a href="#/" class="brand-logo">Campfire</a>
                {auth_in_app?}
                <ul class="right hide-on-med-and-down">
                    {is_admin?}
                    <li class="{forums_page_class}"><a href="{base_url}main/index">Forums</a></li>
                    <li class="{admin_page_class}"><a href="{base_url}admin/index">Administration</a></li>
                    {/is_admin?}
                    <li><a href="{base_url}authenticate/logout">Logout</a></li>
                </ul>
                <span class="user-info right">{user.firstName} {user.lastName} ({user_role})</span>
                {/auth_in_app?}
            </div>
        </div>
    </nav>