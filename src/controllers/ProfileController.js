const Profile = require('../model/Profile')

module.exports = {
    index (req, res) {
       return res.render("profile", {profile: Profile.get()})
    },

    update (req, res) {

        const data = req.body
        const weeks_per_year = 52
        const weeks_per_month = (weeks_per_year - data["vacation-per-year"]) / 12
        const week_total_hours = data["hours-per-day"] * data["days-per-week"]
        const monthly_total_hours = week_total_hours * weeks_per_month

        const value_hour = data["monthly-budget"] / monthly_total_hours

        Profile.update({
            ...Profile.get(),
            ...req.body,
            "value-hour": value_hour
        })

        return res.redirect('/profile')
    }
}