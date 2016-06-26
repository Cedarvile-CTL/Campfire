<div ng-controller="forumCtrl as forum" ng-init="init('{forum_id}')" class="container">
    <a href="{base_url}main/forum/{forum_id}" class="btn btn-waves">&laquo; Back to forum</a>
    <h1>{{forum.forum.label}}</h1>

    <h2>Forum overall</h2>
    <table>
        <tr>
            <th>Participant</th>
            <th># Posts</th>
            <th>% Posts</th>
            <th>Sum of Scores</th>
            <th>Raw Average</th>
            <th>Weighted Average</th>
        </tr>
        {forum.posts_data}
        <tr>
            <td>{user.firstName} {user.lastName}</td>
            <th>{num_posts}</th>
            <th>{perc_posts}</th>
            <th>{score_sum}</th>
            <th>{score_avg}</th>
            <th>{score_weighted}</th>
        </tr>
        {/forum.posts_data}
    </table>

    <h2>Individual Threads</h2>
    {threads}
    <h3>Thread #</h3>
    <table>
        {posts_data}


        {/posts_data}
    </table>
    {/threads}
</div>