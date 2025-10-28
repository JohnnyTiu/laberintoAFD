class NPCDFA {
  constructor(initial = "PATRULLAR") {
    this.state = initial;
  }

  transition(evento) {
    const trans = {
      PATRULLAR: { veJugador: "ALERTA" },
      ALERTA:    { veJugador: "PERSEGUIR", pierdeJugador: "REGRESAR" },
      PERSEGUIR: { pierdeJugador: "REGRESAR" },
      REGRESAR:  { llegaPatrulla: "PATRULLAR" }
    };

    const next = trans[this.state] && trans[this.state][evento];
    if (next) {
      this.state = next;
      // console.log("DFA ->", this.state);
      return true;
    }
    return false;
  }
}
