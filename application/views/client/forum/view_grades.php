<div ng-controller="forumCtrl as forum" ng-init="init('{forum_id}')" class="container">
    <a href="{base_url}main/forum/{forum_id}" class="btn btn-waves">&laquo; Back to forum</a>
    <h1>{{forum.forum.label}}</h1>

    <h2>Forum overall</h2>
    <table>
        <tr>
            <th>Participant</th>
            <th>Num. Posts</th>
            <th class="tooltipped" data-position="top" data-delay="50"
                data-tooltip="Raw sum of scores for all scored posts">
                Sum of Scores
            </th>
            <th class="tooltipped" data-position="top" data-delay="50"
                data-tooltip="Each score post is divided by that post's maximum points,
                    which obtains the posts's score percentage. This is multiplied by
                    the post's weight according to the expected post count for the forum.
                    All these values are added together for the posts in his forum to
                    obtain the score here.">Weighted Score</th>
            <th class="tooltipped" data-position="top" data-delay="50"
                data-tooltip="The score from the previous column is capped
                    to this forum's maximum score.">Capped Weighted Score</th>
        </tr>
        {score_data}
        <tr>
            <td>{firstName} {lastName}</td>
            <td>{post_num}</td>
            <td>{score_sum}</td>
            <td>{forum_points_ttl}</td>
            <td>{forum_points_ttl_cap}</td>
        </tr>
        {/score_data}
    </table>
</div>