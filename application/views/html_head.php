<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <title>{page_title}</title>
    <link type="text/css" rel="stylesheet" href="{base_url}assets/base.css" />
    {stylesheets}
    <link type="text/css" rel="stylesheet" href="{base_url}{path}" />
    {/stylesheets}
</head>
<body>
    <header class="navbar navbar-inverse">
        <nav class="container-fluid">
            <h1 class="navbar-header">
                <a href="{base_url}" 
                   class="navbar-brand">App Name</a>
            </h1>
            {auth_in_app?}
            <div>
                <ul class="nav navbar-nav">
                    <li><a href="{base_url}portraits">Home</a></li>
                </ul>
            </div>
            <a href="{base_url}authenticate/logout"
               class="btn btn-default btn-ghost navbar-btn">Logout</a>
            {/auth_in_app?}
        </nav>
    </header>
    <section id="{page_id}" class="container-fluid">