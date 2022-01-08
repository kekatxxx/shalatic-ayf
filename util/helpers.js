// exports.orderByDate = function(arr, includePast){
//     let array = arr.slice();
//     array.sort((a, b) => {
//         if(a.date > b.date){
//           return 1;
//         }else{
//           return -1;
//         }
//     });
//     if(includePast !== true){
//       array = array.filter(elem => {
//         return new Date(elem.date).getTime() > Date.now();
//       });
//     }
//     return array;
// };

// exports.getLessonsInNextDays = function(arr, days_start, days_end){
//   const startDate = new Date(Date.now() + days_start*24*60*60*1000);
//   //console.log('sta', startDate);
//   let endDate = null;
//   if(days_end){
//     endDate = new Date(Date.now() + days_end*24*60*60*1000);
//     //console.log('end', endDate);
//   }
//   const array = arr.filter(elem => {
//     const lessonDate = new Date(elem.date);
//     if (endDate !== null){
//       return lessonDate > startDate && lessonDate < endDate;
//     }
//     return lessonDate > startDate;
//   });
//   return array;
// }

// exports.getLessonsInMonth = function(arr, month, year){
//   let lessons = arr.slice();
//   lessons = lessons.filter(elem => {
//     const lessonDate = new Date(elem.date);
//     return lessonDate.getMonth() === month && lessonDate.getFullYear() === year;
//   });
//   return lessons;
// }

exports.formatDate = function(date, includeYear){
  const nomeGiorno = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
  const nomeMese = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  let returnDate = nomeGiorno[date.getDay()] + " ";
  returnDate += date.getDate() + " ";
  returnDate += nomeMese[date.getMonth()] + " ";
  if(includeYear){
    returnDate += date.getFullYear() + " ";
  }
  if(date.getHours() < 10){
    returnDate += "0";
  }
  returnDate += date.getHours() + ":";
  if(date.getMinutes() < 10){
    returnDate += "0";
  }
  returnDate += date.getMinutes();
  return returnDate
}

exports.getInputFormDate = function(date){
  return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
}

exports.getInputFormTime = function(date){
  let time ="";
  if(date.getHours() < 10){
    time += "0";
  }
  time += date.getHours() + ":";
  if(date.getMinutes() < 10){
    time += "0";
  }
  time += date.getMinutes();
  return time;
}

exports.getLessonsByUserId = function(arr, userId){
  let lessons = arr.slice();
  lessons = lessons.filter(elem => {
    let userEst = false;
    elem.participants.forEach(part => {
      if(part.userId !== undefined && part.userId.toString() === userId.toString()){
        userEst = true;
      }
    });
    return userEst;
  });
  return lessons;
}
