let data = {
  name: "Karyme",
  avatar: "https://avatars.githubusercontent.com/karymereis1",
  "monthly-budget": 3000,
  "days-per-week": 5,
  "hours-per-day": 5,
  "vacation-per-year": 4,
  "value-hour": 220,
};

module.exports = {
  get() {
    return data;
  },
  update(newData) {
    data = newData;
  }
}


