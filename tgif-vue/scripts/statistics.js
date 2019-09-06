var app = new Vue ({
  el: "#app",
  congressData: {
    congressMembersVue: null,
    parties: [],
    statistics: {
      democratsNumber: 0,
      republicansNumber: 0,
      independentsNumber: 0,
      total: 0,
      democratsAverageVotesWithParty: 0,
      republicansAverageVotesWithParty: 0,
      independentsAverageVotesWithParty: 0,
      leastEngaged: [],
      mostEngaged: [],
      leastLoyal: [],
      mostLoyal: []
    }
  },
  
  methods: {
    init(membersVue) {
      this.congressMembersVue = membersVue;
      this.showParties();
      this.showStatistics();
    },
    
    showParties() {
      this.congressMembersVue.forEach(member => {
        var showParty = this.parties.find(party => party.name === member.party);
        if (showParty) {
          showParty.membersVue.push(member);
        } else {
          this.parties.push({
            name: member.party,
            membersVue: [member]
          });
        }
      });
    },
    
    showStatistics() {
      this.statistics.democratsNumber = this.getPartyMembersNumber("D");
      this.statistics.republicansNumber = this.getPartyMembersNumber("R");
      this.statistics.independentsNumber = this.getPartyMembersNumber("I");
      this.statistics.total = this.congressMembersVue.length;
      
      this.statistics.democratsAverageVotesWithParty = this.getAverageVotesWithParty("D");
      this.statistics.republicansAverageVotesWithParty = this.getAverageVotesWithParty("R");
      this.statistics.independentsAverageVotesWithParty = this.getAverageVotesWithParty("I");
      
      this.statistics.mostEngaged = this.getTenPercent("missed_votes_pct", (m1, m2) => m2.missed_votes_pct - m1.missed_votes_pct);
      this.statistics.leastEngaged = this.getTenPercent("missed_votes_pct", (m1, m2) => m1.missed_votes_pct - m2.missed_votes_pct);
      
      this.statistics.mostLoyal = this.getTenPercent("votes_with_party_pct", (m1, m2) => m1.votes_with_party_pct - m2.votes_with_party_pct);         
      this.statistics.leastLoyal = this.getTenPercent("votes_with_party_pct", (m1, m2) => m2.votes_with_party_pct - m1.votes_with_party_pct);
    },
    
    getAverageVotesWithParty(partyName) {
      var showParty = this.parties.find(party => party.name === partyName);
      if (showParty) {
        return Math.round(
          showParty.membersVue
          .map(member => member.votes_with_party_pct)
          .reduce((acum, pct) => acum + pct, 0) / showParty.membersVue.length
          );
        }
        return 0;
      },
      
      getTenPercent(key, fnArrange) {
        this.congressMembersVue.sort(fnArrange);
        var maxValue = this.congressMembersVue[Math.round(this.congressMembersVue.length * 0.1) - 1][key];
        
        if (this.congressMembersVue[0][key] >= maxValue) {
          return this.congressMembersVue.filter(m => m[key] >= maxValue);
        }
        return this.congressMembersVue.filter(m => m[key] <= maxValue);
      },
      
      getPartyMembers(partyName) {
        var showParty = this.parties.find(party => party.name === partyName);
        
        if (showParty) {
          return showParty.membersVue;
        }
      },
      
      getPartyMembersNumber(partyName) {
        var showMembers = this.getPartyMembers(partyName);
        
        if (showMembers) {
          return showMembers.length;
        }
        return 0;
      },
      
      getMemberFullName(member) {
        return "<a href=\"" + member.url + "\">" + (member.first_name + " " + (member.middle_name || "") + " " + member.last_name) + "</a>";
      },
      
      getMemberVotesWithParty(member) {
        return Math.round(member.total_votes * member.votes_with_party_pct / 100);
      }
    }
  });