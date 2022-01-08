function formatDate(date){
    const nomeGiorno = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
    const nomeMese = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
    return nomeGiorno[date.getDay()]+" "+date.getDate()+" "+nomeMese[date.getMonth()]+" " + date.getHours() + ":" + date.getMinutes();
}