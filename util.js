//////// remove dupliacate array //////////////////  
  function arrayEqual(a, b) {
    if (a.length !== b.length) { return false; }
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
  }

  function contains(array, item) {
    for (var i = 0; i < array.length; ++i) {
        if (arrayEqual(array[i], item)) {
            return true;
        }
    }
    return false;
  }

  function normalize(array) {
    var result = [];
    for (var i = 0; i < array.length; ++i) {
        if (!contains(result, array[i])) {
            result.push(array[i]);
        }
    }
    return result;
  }
 //////// remove dupliacate array //////////////////   
  function loadingStart(){
    document.getElementById("loading").classList.remove("invisible");
  }
    
  function loadingEnd(){
    document.getElementById("loading").classList.add("invisible");
  }

  function showSpin3(){
    document.getElementById('resp-spinner1').classList.remove("d-none");
    document.getElementById('resp-spinner2').classList.remove("d-none");
    document.getElementById('resp-spinner3').classList.remove("d-none");
  }

  function hideSpin3(){
    document.getElementById('resp-spinner1').classList.add("d-none");
    document.getElementById('resp-spinner2').classList.add("d-none");
    document.getElementById('resp-spinner3').classList.add("d-none");
  } 

  function swColor(target,result){
    const color = Number(result) >= Number(target) ? "green" : "red"
    return color
  }  

  function popS1(){
    const link = "https://cri.hdc.moph.go.th/hdc/reports/report.php?cat_id=db30e434e30565c12fbac44958e338d5&id=8897d18c21ad97d18cfb0a98abc5fb3f"
    let result =  ` 
      <div>
       <h4>S1</h4>
       <p>19.1 ร้อยละหญิงตั้งครรภ์ที่ได้รับบริการตรวจสุขภาพช่องปากและขัดทําความสะอาดฟัน</p>
       <a href="${link}" target="blank">link</a>
      </div>
    `
    Swal.fire({
      position: "center",
      width:"auto",      
      html:result,
      showConfirmButton: true,      
     });
  }

  function popS2(){
    const link = "https://cri.hdc.moph.go.th/hdc/reports/report.php?cat_id=db30e434e30565c12fbac44958e338d5&id=c314de5a8bd00380b4f4f5632d7bc324"
    let result =  ` 
      <div>
       <h4>S2</h4>
       <p>17.4 ร้อยละเด็ก 0-2 ปี ได้รับการตรวจสุขภาพช่องปาก</p>
       <a href="${link}" target="blank">link</a>
      </div>
    `
    Swal.fire({
      position: "center",
      width:"auto",      
      html:result,
      showConfirmButton: true,      
     });
  }
 
function popS3(){
 const link = "https://cri.hdc.moph.go.th/hdc/reports/report.php?cat_id=db30e434e30565c12fbac44958e338d5&id=bac1a981ea682e99509ddeafbe556112"
    let result =  ` 
      <div>
       <h4>S3</h4>
       <p>17.5 ร้อยละเด็ก 0-2 ปี ผู้ปกครองได้รับการฝึกแปรงฟันแบบลงมือปฏิบัติ หรือ ได้รับการฝึกแปรงฟันแบบลงมือปฏิบัติ และ plaque control</p>
       <a href="${link}" target="blank">link</a>
      </div>
    `
    Swal.fire({
      position: "center",
      width:"auto",      
      html:result,
      showConfirmButton: true,      
     });
}

function popS4(){
 const link = "https://cri.hdc.moph.go.th/hdc/reports/report.php?cat_id=db30e434e30565c12fbac44958e338d5&id=8ad1c0936b86f836295150428063820e"
       let result =  ` 
         <div>
          <h4>S4</h4>
          <p>17.9 ร้อยละเด็ก 3-5 ปี เคลือบ/ทา ฟลูออไรด์เฉพาะที่</p>
          <a href="${link}" target="blank">link</a>
         </div>
       `
       Swal.fire({
         position: "center",
         width:"auto",      
         html:result,
         showConfirmButton: true,      
        });
}  

function popS5(){
 const link = "https://cri.hdc.moph.go.th/hdc/reports/report.php?cat_id=db30e434e30565c12fbac44958e338d5&id=8b6e9aa2219613b9b6443a7724b7fd04"
          let result =  ` 
            <div>
             <h4>S5</h4>
             <p>19.3 ร้อยละเด็กอายุ 6-12 ปี ได้รับการ เคลือบหลุมร่องฟันกรามแท้</p>
             <a href="${link}" target="blank">link</a>
            </div>
          `
          Swal.fire({
            position: "center",
            width:"auto",      
            html:result,
            showConfirmButton: true,      
           });
} 

function popS6(){
 const link = "https://cri.hdc.moph.go.th/hdc/reports/report.php?cat_id=db30e434e30565c12fbac44958e338d5&id=b8c600c3da072c24b375b07c56fa43cf"
        let result =  ` 
          <div>
            <h4>S6</h4>
            <p>17.20 ร้อยละผู้มีอายุ 15-59 ปี ได้รับบริการทันตกรรม</p>
            <a href="${link}" target="blank">link</a>
          </div>
        `
        Swal.fire({
            position: "center",
            width:"auto",      
            html:result,
            showConfirmButton: true,      
        });
} 

function popS7(){
 const link = "https://cri.hdc.moph.go.th/hdc/reports/report.php?cat_id=db30e434e30565c12fbac44958e338d5&id=1fb6b46f1d1fd42362f97072f4b3b653"
        let result =  ` 
             <div>
               <h4>S7</h4>
               <p>17.23 ร้อยละผู้สูงอายุ ได้รับการตรวจช่องปาก</p>
               <a href="${link}" target="blank">link</a>
             </div>
        `
        Swal.fire({
               position: "center",
               width:"auto",      
               html:result,
               showConfirmButton: true,      
        });
}

function popS8(){
 const link = "https://cri.hdc.moph.go.th/hdc/reports/report.php?cat_id=db30e434e30565c12fbac44958e338d5&id=af2408900a6a2ed369b940680438785d"
           let result =  ` 
                <div>
                  <h4>S8</h4>
                  <p>17.21 ร้อยละของกลุ่มก่อนวัยผู้สูงอายุที่ได้รับการคัดกรอง PMDs</p>
                  <a href="${link}" target="blank">link</a>
                </div>
           `
           Swal.fire({
                  position: "center",
                  width:"auto",      
                  html:result,
                  showConfirmButton: true,      
           });
}

function popS9(){
 const link = "https://cri.hdc.moph.go.th/hdc/reports/report.php?cat_id=db30e434e30565c12fbac44958e338d5&id=9f51a01dc95a8e3dc8e76d64c9209b7b"
              let result =  ` 
                   <div>
                     <h4>S9</h4>
                     <p>17.22 ร้อยละของกลุ่มผู้สูงอายุที่ได้รับการคัดกรอง PMDs</p>
                     <a href="${link}" target="blank">link</a>
                   </div>
              `
              Swal.fire({
                     position: "center",
                     width:"auto",      
                     html:result,
                     showConfirmButton: true,      
              });
}

function showCocTable(){
  $('#coc').show()
  $('#hdc').hide()
  $('#btnCoc').hide() 
  $('#btnHdc').show() 
}

function showHdcTable(){ 
  $('#coc').hide()
  $('#hdc').show()
  $('#btnCoc').show() 
  $('#btnHdc').hide()
}
