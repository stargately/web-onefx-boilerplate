export default `
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <title>500 Internal Server Error</title>
    <link rel="stylesheet" href="/error-page.css">
    <style type="text/css" media="screen">
    </style>
  </head>
  <body>
    <div class="container max-w-4xl mx-auto p-4">
      <div class="flex flex-col items-center p-5 md:flex-row">
        <div class="md:p-5">
          <h1 class="font-bold text-5xl leading-loose">Oops!</h1>
          <h2 class="text-3xl leading-loose">Well, this is unexpected…</h2>
          <h6 class="font-medium leading-loose text-gray-700 mb-2">Error code: 500</h6>
          <p class="text-gray-700 mb-12">An error has occurred and we're working to fix the problem! We’ll be up and running
          shortly.</p>
        </div>
        <div class="flex justify-items-center py-12 md:px-5">
          <img src="/error-page.gif" alt="Girl has dropped her ice cream.">
        </div>
      </div>
    </div>
  </body>
</html>
`;
