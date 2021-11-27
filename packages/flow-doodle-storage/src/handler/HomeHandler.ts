import { ExpressHandler } from '../lib/routing'

const HomeHandler: ExpressHandler = async(_req, res) => {
    return res.send(`
  <!doctype HTML>
<html>
<head>
    <title>Flow Doodle Storage API</title>
</head>
<body>
    <h1>Flow Doodle Storage API</h1>
</body>
</html>`)
}

export default HomeHandler
