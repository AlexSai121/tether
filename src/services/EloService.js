const EloService = {
      calculateEloChange: (currentElo, result) => {
            // result can be 'success', 'fail', 'approved_abandon', 'denied_abandon'
            switch (result) {
                  case 'success':
                        return 25;
                  case 'fail':
                  case 'denied_abandon':
                        return -15;
                  case 'approved_abandon':
                        return -5;
                  default:
                        return 0;
            }
      },

      getRank: (elo) => {
            if (elo >= 3000) return "Archivist";
            if (elo >= 2500) return "Preserver";
            if (elo >= 2000) return "Observer";
            if (elo >= 1500) return "Novice";
            return "Drifter";
      }
};

export default EloService;
