function fetchNewData(chamber) {
    var url = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`;
  
    fetch(url, {headers: {"X-API-Key": "YvFnZGeSeZQQbD0kRrrTF6i3DuWHYQ18eFDQrBHw"}})
        .then(answer => answer.json())
        .then(dataJson => {
            var membersVue = dataJson.results[0].members;
            app.init(membersVue);
        })
}

if (window.location.pathname.includes("senate")) {
    fetchNewData("senate");
} else if (window.location.pathname.includes("house")) {
    fetchNewData("house");
}