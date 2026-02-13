const MatchmakingService = {
      findMatch: (mode) => {
            return new Promise((resolve) => {
                  setTimeout(() => {
                        resolve({
                              name: 'Alex',
                              major: 'CompSci',
                              avatar: '🦁',
                              rank: 'Gold II',
                              status: 'Connected'
                        });
                  }, 3000);
            });
      }
};

export default MatchmakingService;
