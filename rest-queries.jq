jq .[] | select(.metadata.viewModel == true) | .name
http://localhost:3030/api/$node.services

jq .[] | .settings | map(has(.aggregate))
http://localhost:3030/api/$node.services

jq .[] | .name
http://localhost:3030/api/$node.actions