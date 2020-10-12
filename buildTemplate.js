'use strict';
const fs = require('fs');
const csv = require('csv-parser');

function _uuid() {
  var d = Date.now();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

//load list
var memberList = [];
fs.createReadStream('list.csv')
  .pipe(csv())
  .on('data', (row,index) => {
    memberList.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    //load template
    let rawFBTemplate = fs.readFileSync('FBTemplate.json');
    let rawTestTemplate = fs.readFileSync('singleTestTempls.json');
    
    //build template
    let FBTemplate = JSON.parse(rawFBTemplate);
    memberList.forEach(member=>{
      let TestTemplate = JSON.parse(rawTestTemplate);
      TestTemplate.id = _uuid();
      TestTemplate.name = member.ID+'_Remove_'+member.MemberName;
      TestTemplate.commands.forEach(test=>{
        test.id=_uuid();
        if(test.target=='@name'){
          test.target = member.MemberName;
        }
      });
      FBTemplate.tests.push(TestTemplate);
      FBTemplate.suites[0].tests.push(TestTemplate.id);
    });
    // console.log(FBTemplate);
    // console.log(student);
    
    //save as new json
    fs.writeFileSync('export_SeleniumIDE_Project_all.side',JSON.stringify(FBTemplate));
  });