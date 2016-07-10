var scopes = ["https://www.googleapis.com/auth/drive"];
var CLIENTID = "761475406211-2d6104gl40n28l4ojq5is01c3u0tm7ub.apps.googleusercontent.com"
var scriptID = "MKqnzb-JX01aaSyAZrf5uG1RLchR5zaYm";

             function checkAuth(){
                gapi.auth.authorize(
                {
                'client_id': CLIENTID,
                'scope': SCOPES.join(' '),
                'immediate': true
                }, handleAuthResult);
            };

    function handleAuthResult(authResult) {
        var authorizeDiv = document.getElementById('authorize-div');
        if (authResult && !authResult.error) {
          // Hide auth UI, then load client library.+
          authorizeDiv.style.display = 'none';
          window.location.replace('https://madroxprime.github.io');
        } else {
          // Show auth UI, allowing the user to initiate authorization by
          // clicking authorize button.
          authorizeDiv.style.display = 'inline';
        }
    }
    function handleAuthClick(event) {
        gapi.auth.authorize(
          {client_id: CLIENTID, scope: SCOPES, immediate: false},
          handleAuthResult);
        return false;
      };   