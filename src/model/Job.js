let data = [
  {
    id: 1,
    name: "testes",
    "daily-hours": 2,
    "total-hours": 60,
    created_at: Date.now(),
  },
  {
    id: 2,
    name: "karyme",
    "daily-hours": 2,
    "total-hours": 2,
    created_at: Date.now(),
  },
];

module.exports = {
    get(){
        return data
    },
    update(newJob){
        data = newJob
    },
    delete(id){
        data = data.filter(job => Number(job.id) !== Number(id))
    }
}