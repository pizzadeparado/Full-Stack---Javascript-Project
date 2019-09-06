var app = new Vue({
  el: "#app",
  data: {
    congressMembersVue: null,
    filteredMembers: null,
    checkValues: null,
    selectValue: null,
  },
  
  methods: {
    init(membersVue) {
      this.congressMembersVue = membersVue;
      this.checkValues = ["D", "R", "I"];
      this.selectValue = "";
      this.loadFilteredMembers();
    },
    
    loadFilteredMembers() {
      this.filteredMembers = this.congressMembersVue
      .filter(member => (!this.selectValue || member.state === this.selectValue))
      .filter(member => this.checkValues.includes(member.party));
    },
    
    getMemberFullName(member) {
      return member.first_name + " " + (member.middle_name || "") + " " + member.last_name;
    },
    
    getMemberVotesWithParty(member) {
      return Math.round(member.total_votes * member.votes_with_party_pct / 100);
    }
  }
});