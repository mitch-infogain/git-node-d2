module.exports = function (router) {
  router.get('/', (request, response) => response.send('hello from skillsoft'));
  router.post('/addemployee', (request, response) => {
    const empName = request.body.empName;
    const empPass = request.body.empPass;
    response.end(`POST success, you sent ${empName} and ${empPass}, thanks!`);
  });
};