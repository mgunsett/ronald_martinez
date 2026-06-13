export function rowToMatch(row) {
  return {
    home:      { name: row.home_team, shield: row.home_shield },
    away:      { name: row.away_team, shield: row.away_shield },
    homeScore: row.home_score,
    awayScore: row.away_score,
    date:      row.match_date,
    stadium:   row.stadium,
    competition: row.competition || '',
  }
}

export const defaultMatches = {
  last: {
    home:      { name: 'Talleres', shield: null },
    away:      { name: 'Boca Juniors', shield: null },
    homeScore: 2,
    awayScore: 1,
    date:      '08 Jun 2025',
    stadium:   'Mario Kempes',
    competition: 'Liga Profesional',
  },
  next: {
    home:      { name: 'River Plate', shield: null },
    away:      { name: 'Talleres', shield: null },
    homeScore: null,
    awayScore: null,
    date:      '22 Jun 2025',
    stadium:   'Monumental',
    competition: 'Liga Profesional',
  },
}
