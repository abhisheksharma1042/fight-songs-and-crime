# Fight-Songs-and-Crime

# Crime Data

I used a data set that was based off of crime data published by the FBI, Andrew Hurst published an articles with his analysis on the data the methodology used is explainned below:

"For this study, we analyzed crime data published by the FBI. We checked four data tables in the series "Offenses Known to Law Enforcement, by State by University and College" corresponding to 2015 through 2018.

The FBI's data represents the volume of violent and property crimes as reported by university/college law enforcement. Schools are included in the FBI's dataset as long as their law enforcement offices submit 12 months of data for a given year.

We judged schools based on the probability of students encountering property crime and violent crime within a four-year span, representative of the length of time required for most bachelor's degree programs. The rates of violent crime are low for even the most dangerous schools, so our rankings prioritize property crime — always much more frequent.

Violent crime refers to murder and negligent manslaughter, aggravated assault, robbery and rape. Rape is a large part of crime on college campuses, but it's reported differently in each state, jurisdiction and school.

Property crime is comprised of reported acts of burglary, larceny, motor vehicles and arson.

We surveyed every school with more than 10,800 students in 2018, the median number of enrolled students in all the colleges and universities included in the FBI's dataset for that year. We computed the average student enrollment for these schools from 2015–2018.

Then, we calculated the average rate of violent and property crime per year, per institution. Using these average rates of crime, we calculated the chances of students experiencing property and violent crime by performing binomial distributions, per 1,000 students. A binomial distribution figures the probability of something happening in a time period given a known rate of change — in our case, the probability of a student experiencing crime over a four-year period.

We ordered our safest schools according to each institution's average place on both the violent and property crime lists: a school that experiences the least amount of violent crime and the fourth-least property crime has an average position of 2.5.

We also found the number of law enforcement officials per 1,000 students using the FBI's "Full-time Law Enforcement Employees, by State and University and College" from 2018.""

Attributed to Andrew Hurst

### Reference: https://www.valuepenguin.com/2020/02/which-colleges-and-universities-have-most-crime

##

# Song Data

The data set was dowloaded from fivethirtyeight github repository.

"Data about fight songs from all schools in the Power Five conferences — the ACC, Big Ten, Big 12, Pac-12 and SEC — plus Notre Dame. Some schools have more than one fight song, and some of the songs sanctioned as “official” by their schools aren’t the ones that fans sing out. We chose the songs that seemed best-known and best-loved. We also limited our analysis to the lyrics sung most regularly and also published by the school, so some verses were not included in the analysis. The tempo and length information come from the version of the song we chose from those available on Spotify."

Column definitions:

| Column            | Description                                                                                                             |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `school`          | School name                                                                                                             |
| `conference`      | School college football conference                                                                                      |
| `song_name`       | Song title                                                                                                              |
| `writers`         | Song author                                                                                                             |
| `year`            | Year the song written. Some values are `Unknown`                                                                        |
| `student_writer`  | Was the author a student? Some values are `Unknown`                                                                     |
| `official_song`   | Is the song the official fight song according to the university?                                                        |
| `contest`         | Was the song chosen as the result of a contest?                                                                         |
| `bpm`             | Beats per minute                                                                                                        |
| `sec_duration`    | Duration of song in seconds                                                                                             |
| `fight`           | Does the song say “fight”?                                                                                              |
| `number_fights`   | Number of times the song says “fight”?                                                                                  |
| `victory`         | Does the song say “victory”?                                                                                            |
| `win_won`         | Does the song say “win” or “won”?                                                                                       |
| `victory_win_won` | Does the song say “victory,” “win” or “won”?                                                                            |
| `rah`             | Does the song say “rah”?                                                                                                |
| `nonsense`        | Does the song use nonsense syllables (e.g. "Whoo-Rah" or "Hooperay")                                                    |
| `colors`          | Does the song mention the school colors?                                                                                |
| `men`             | Does the song refer to a group of men (e.g. men, boys, sons, etc.)?                                                     |
| `opponents`       | Does the song mention any opponents?                                                                                    |
| `spelling`        | Does the song spell anything?                                                                                           |
| `trope_count`     | Total number of tropes (`fight`, `victory`, `win_won`, `rah`, `nonsense`,`colors`, `men`, `opponents`, and `spelling`). |
| `spotify_id`      | Spotify id for the song                                                                                                 |

### Reference: https://github.com/fivethirtyeight/data/tree/master/fight-songs

# Intersection of the data sets

`data.js` contains the intersection of the two data sets with a total of 21 schools.

Column definitions:

| Column                                                                 | Description                                                                       |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| The table above with the addition of these two fields for each school. |
| `violent`                                                              | Probability of a student experiencing a `violent` crime over a period of 4 years  |
| `property`                                                             | Probability of a student experiencing a `property` crime over a period of 4 years |

# Interaction

- Sorting data in ascending/descending order based on trope count
- Brush selection can be changed to include all the data values or a subset which will be reflected on all charts
- Selection of a school highlights the school in all charts
- For the scatter plot hovering on a data point reveals the values associated with it annd higlights it.
