define(['jquery'], function (jq) {
    if(typeof $ == "undefined")
    return $ = jq.noConflict( true );
    else return $;
});
