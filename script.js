var gMapPcu = []
var gAmpOption = []
var gPcu = []

var mappcu = 'https://script.google.com/macros/s/AKfycbxueue8PgSZ3Xd6kDtyZkVXWUisT5r9XeIL_ViwqQCB-jpY0ulk2NPIlnnyxDg9giZA/exec?action=getData'
var url1 = 'https://opendata.moph.go.th/api/report_data/s_kpi_dental62/' //หญิงมีครรภ์ตรวจ dental และขัดฟัน
var url2 = 'https://opendata.moph.go.th/api/report_data/s_kpi_dental20/' //0-2 ปี ตรวจ dental 
var url3 = 'https://opendata.moph.go.th/api/report_data/s_kpi_dental21/' //0-2 ปี ฝึกแปรงฟัน
var url4 = 'https://opendata.moph.go.th/api/report_data/s_kpi_dental25/' //3-5 ปี ทาฟลูออไรด์
var url5 = 'https://opendata.moph.go.th/api/report_data/s_kpi_dental64/' //6-12 ปี sealant
var url6 = 'https://opendata.moph.go.th/api/report_data/s_kpi_dental44/' //15-59 ปี รับบริการทันตกรรม
var url7 = 'https://opendata.moph.go.th/api/report_data/s_kpi_dental33/' //ผู้สูงอายุตรวจ dental
var url8 = 'https://opendata.moph.go.th/api/report_data/s_kpi_dental51/' //pmd ก่อนสูงอายุ
var url9 = 'https://opendata.moph.go.th/api/report_data/s_kpi_dental52/' //pmd สูงอายุ
var url10 = 'https://opendata.moph.go.th/api/report_data/s_kpi_dental61/' //dental coc
var url11 = 'https://opendata.moph.go.th/api/report_data/s_dental_2/' //บริการทันตกรรมทุกสิทธิ์(ครั้ง)
var loadedDataCount = 0

var index1,index2,index3,index4,index5,index6,index7,index8,index9,index10;
var lastBudyear=""

  async function fetchAPI(url) {  
    // $('#d_table').html('<div class="col">Please Wait.....</div>')   
    console.log("loading start"); 
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        const select = data.filter(r => r['areacode'].substring(0, 2) === "57");
        loadedDataCount++;

        if (loadedDataCount == 10) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "โหลดข้อมูลสำเร็จ",
            showConfirmButton: false,
            timer: 1500
           });
           hideSpin3()
           document.getElementById("btn1").disabled = false
           console.log("loading end");
        }

        console.log(loadedDataCount);
        return select;
    } catch (error) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "การเชื่อมต่อผิดพลาด!",
          showConfirmButton: true,        
         });
        hideSpin3()       
        console.error("Error in fetch:", error.message);
    }
  }

  function beforeLoad(){
    const budyear = $('#budyear').val();
    const ampur = $('#ampur').val(); 

    if(budyear != null && lastBudyear !== budyear){
      index1 = undefined; index2 = undefined; index3 = undefined; index4 = undefined; 
      index5 = undefined; index6 = undefined; index7 = undefined; index8 = undefined; 
      index9 = undefined; index10 = undefined;   
    } 

    if(budyear == null || ampur == null){
      Swal.fire({
        position: "center",
        icon: "error",
        title: "โปรดเลือกข้อมูลให้ครบ!",
        showConfirmButton: false,
        timer: 2000
       });
    }
    else{      
      loadTable()
    }
  }

  async function loadTable() {
    Swal.fire({ title: 'กำลังโหลดข้อมูล โปรดรอ...' });
    Swal.showLoading();
    showSpin3()
    $('#hdc_table').html('')
    document.getElementById("btn1").disabled = true
    loadedDataCount = 0;
    const budyear = $('#budyear').val();
    const ampur = $('#ampur').val();
    gPcu = gMapPcu.filter(r=> r['ampcode'] == ampur).map(r=> r['pcu'])    
    index1 = typeof(index1) == 'undefined' ? await fetchAPI(url1 + budyear) : index1    
    const ampfil1 = index1.filter(r=> r['areacode'].substring(0, 4) == ampur)    
    const dash1 = groupDataPcu(gPcu,ampfil1)

    index2 = typeof(index2) == 'undefined' ? await fetchAPI(url2 + budyear) : index2  
    const ampfil2 = index2.filter(r=> r['areacode'].substring(0, 4) == ampur)    
    const dash2 = groupDataPcu(gPcu,ampfil2)

    index3 = typeof(index3) == 'undefined' ? await fetchAPI(url3 + budyear) : index3
    const ampfil3 = index3.filter(r=> r['areacode'].substring(0, 4) == ampur)    
    const dash3 = groupDataPcu(gPcu,ampfil3)

    index4 = typeof(index4) == 'undefined' ? await fetchAPI(url4 + budyear) : index4
    const ampfil4 = index4.filter(r=> r['areacode'].substring(0, 4) == ampur)    
    const dash4 = groupDataPcu(gPcu,ampfil4)

    index5 = typeof(index5) == 'undefined' ? await fetchAPI(url5 + budyear) : index5
    const ampfil5 = index5.filter(r=> r['areacode'].substring(0, 4) == ampur)    
    const dash5 = groupDataPcu(gPcu,ampfil5)

    index6 = typeof(index6) == 'undefined' ? await fetchAPI(url6 + budyear) : index6
    const ampfil6 = index6.filter(r=> r['areacode'].substring(0, 4) == ampur)    
    const dash6 = groupDataPcu(gPcu,ampfil6)

    index7 = typeof(index7) == 'undefined' ? await fetchAPI(url7 + budyear) : index7
    const ampfil7 = index7.filter(r=> r['areacode'].substring(0, 4) == ampur)     
    const dash7 = groupDataPcu(gPcu,ampfil7)

    index8 = typeof(index8) == 'undefined' ? await fetchAPI(url8 + budyear) : index8
    const ampfil8 = index8.filter(r=> r['areacode'].substring(0, 4) == ampur)    
    const dash8 = groupDataPcuPmds(gPcu,ampfil8)

    index9 = typeof(index9) == 'undefined' ? await fetchAPI(url9 + budyear) : index9
    const ampfil9 = index9.filter(r=> r['areacode'].substring(0, 4) == ampur)    
    const dash9 = groupDataPcuPmds(gPcu,ampfil9) 
    
    index10 = typeof(index10) == 'undefined' ? await fetchAPI(url10 + budyear) : index10
    const ampfil10 = index10.filter(r=> r['areacode'].substring(0, 4) == ampur)    
    const dash10 = groupDataPcuCoc(gPcu,ampfil10) 
    //console.log("coc",dash10)
    
    let newArr = []
    dash1.forEach(r=>{
      let re2 = dash2.filter(f=>f[0] === r[0]).length > 0 ? dash2.filter(f=>f[0] === r[0])[0][3] : 0 //เอาเฉพาะ %
      let re3 = dash3.filter(f=>f[0] === r[0]).length > 0 ? dash3.filter(f=>f[0] === r[0])[0][3] : 0 //เอาเฉพาะ %
      let re4 = dash4.filter(f=>f[0] === r[0]).length > 0 ? dash4.filter(f=>f[0] === r[0])[0][3] : 0 //เอาเฉพาะ %
      let re5 = dash5.filter(f=>f[0] === r[0]).length > 0 ? dash5.filter(f=>f[0] === r[0])[0][3] : 0 
      let re6 = dash6.filter(f=>f[0] === r[0]).length > 0 ? dash6.filter(f=>f[0] === r[0])[0][3] : 0
      let re7 = dash7.filter(f=>f[0] === r[0]).length > 0 ? dash7.filter(f=>f[0] === r[0])[0][3] : 0
      let re8 = dash8.filter(f=>f[0] === r[0]).length > 0 ? dash8.filter(f=>f[0] === r[0])[0][3] : 0
      let re9 = dash9.filter(f=>f[0] === r[0]).length > 0 ? dash9.filter(f=>f[0] === r[0])[0][3] : 0
      
      newArr.push([
        r[0],r[3],re2,re3,re4,re5,re6,re7,re8,re9
      ])      
    })

    //console.log(newArr)
    genTable(newArr)
    genTableCoc(dash10)
    lastBudyear = budyear
    if (typeof(index1) != 'undefined' && typeof(index2) != 'undefined' && typeof(index3) != 'undefined' 
        && typeof(index4) != 'undefined' && typeof(index5) != 'undefined' && typeof(index6) != 'undefined' 
        && typeof(index7) != 'undefined' && typeof(index8) != 'undefined' && typeof(index9) != 'undefined' 
        && typeof(index10) != 'undefined') {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "โหลดข้อมูลสำเร็จ",
        showConfirmButton: false,
        timer: 1500
       });
       hideSpin3()
       document.getElementById("btn1").disabled = false
       console.log("loading end");
    }
  }  

  function genTable(arr){
    let result = `<table class="table table-bordered" id="mainTable1">
       <thead>
        <th>PCU</th>
        <th class="dt-center"><div type="button" onclick="popS1()">S1(55%)</div></th>
        <th class="dt-center"><div type="button" onclick="popS2()">S2(50%)</div></th>
        <th class="dt-center"><div type="button" onclick="popS3()">S3(50%)</div></th>
        <th class="dt-center"><div type="button" onclick="popS4()">S4(50%)</div></th>
        <th class="dt-center"><div type="button" onclick="popS5()">S5(30%)</div></th>
        <th class="dt-center"><div type="button" onclick="popS6()">S6(25%)</div></th>
        <th class="dt-center"><div type="button" onclick="popS7()">S7(40%)</div></th>
        <th class="dt-center"><div type="button" onclick="popS8()">S8(40%)</div></th>
        <th class="dt-center"><div type="button" onclick="popS9()">S9(40%)</div></th>
       </thead>    
    `

    arr.forEach(r=>{
      let color1 = swColor(55,r[1])
      let color2 = swColor(50,r[2])
      let color3 = swColor(50,r[3])
      let color4 = swColor(50,r[4])
      let color5 = swColor(30,r[5])
      let color6 = swColor(25,r[6])
      let color7 = swColor(40,r[7])
      let color8 = swColor(40,r[8])
      let color9 = swColor(40,r[9])
      result+= `<tr>
       <td>${r[0]}</td>
       <td class="dt-center" style="color:${color1}">${r[1]}</td>
       <td class="dt-center" style="color:${color2}">${r[2]}</td>
       <td class="dt-center" style="color:${color3}">${r[3]}</td>
       <td class="dt-center" style="color:${color4}">${r[4]}</td>
       <td class="dt-center" style="color:${color5}">${r[5]}</td>
       <td class="dt-center" style="color:${color6}">${r[6]}</td>
       <td class="dt-center" style="color:${color7}">${r[7]}</td>
       <td class="dt-center" style="color:${color8}">${r[8]}</td>
       <td class="dt-center" style="color:${color9}">${r[9]}</td>
      </tr>`
    })

    

    result+= "</table>"
    $('#hdc_table').html(result)
  }

  function genTableCoc(arr){
    let result = `
       <h5>17.26 ร้อยละผู้สูงอายุ ที่ติดบ้าน ติดเตียงได้รับการตรวจช่องปาก (ร้อยละ 40)</h5> 
       <table class="table table-bordered" id="mainTable2">
       <thead>
        <th>PCU</th>
        <th class="dt-center"><div>ติดบ้านและติดเตียง</div></th>
        <th class="dt-center"><div>ติดบ้าน</div></th>
        <th class="dt-center"><div>ติดเตียง</div></th>        
       </thead>    
    `
    arr.forEach(r=>{
      let color1 = swColor(40,r[3])
      let color2 = swColor(40,r[6])
      let color3 = swColor(40,r[9])
      
      result+= `<tr>
       <td>${r[0]}</td>
       <td class="dt-center" style="color:${color1}">${r[3]}</td>
       <td class="dt-center" style="color:${color2}">${r[6]}</td>
       <td class="dt-center" style="color:${color3}">${r[9]}</td>
       
      </tr>`
    })
    result+= "</table>"
    $('#coc_table').html(result)
  }

  function groupDataPcu(pcu,amFilter){
    let arr = []
    let pcuAllTarget = amFilter.map(m => m['target']).reduce((a, b) => Number(a) + Number(b), 0) 
    let pcuAllResult = amFilter.map(m => m['result']).reduce((a, b) => Number(a) + Number(b), 0) 
    let pucAllPercent = isNaN(pcuAllResult/pcuAllTarget) ? 0 : Number(((pcuAllResult/pcuAllTarget)*100).toFixed(2))
    pcu.forEach(r=>{
      let pcufil = amFilter.filter(f=> r.substring(0, 5) == f['hospcode'])      
      if(pcufil.length > 0){
         let target = pcufil.map(m => m['target']).reduce((a, b) => Number(a) + Number(b), 0) 
         let result = pcufil.map(m => m['result']).reduce((a, b) => Number(a) + Number(b), 0) 
         let percent = isNaN(result/target) ? 0 : Number(((result/target)*100).toFixed(2))
         arr.push([
           r,
           target,
           result,
           percent
         ])
      }
      else{
         arr.push([ r, 0, 0, 0.00])
      }
   })
   arr.push([
      "รวม",
      pcuAllTarget,
      pcuAllResult,
      pucAllPercent
    ])    
    return arr
  }

  function groupDataPcuPmds(pcu,amFilter){
    let arr = []
    let pcuAllTarget = amFilter.map(m => m['target']).reduce((a, b) => Number(a) + Number(b), 0) 
    let pcuAllResult = amFilter.map(m => m['result1']).reduce((a, b) => Number(a) + Number(b), 0) 
    let pucAllPercent = isNaN(pcuAllResult/pcuAllTarget) ? 0 : Number(((pcuAllResult/pcuAllTarget)*100).toFixed(2))
    pcu.forEach(r=>{
      let pcufil = amFilter.filter(f=> r.substring(0, 5) == f['hospcode'])      
      if(pcufil.length > 0){
         let target = pcufil.map(m => m['target']).reduce((a, b) => Number(a) + Number(b), 0) 
         let result = pcufil.map(m => m['result1']).reduce((a, b) => Number(a) + Number(b), 0) 
         let percent = isNaN(result/target) ? 0 : Number(((result/target)*100).toFixed(2))
         arr.push([
           r,
           target,
           result,
           percent
         ])
      }
      else{
         arr.push([ r, 0, 0, 0.00])
      }
   })
   arr.push([
      "รวม",
      pcuAllTarget,
      pcuAllResult,
      pucAllPercent
    ])    
    return arr
  }

  function groupDataPcuCoc(pcu,amFilter){
    let arr = []
    let pcuAllTarget1 = amFilter.map(m => m['target1']).reduce((a, b) => Number(a) + Number(b), 0) 
    let pcuAllResult1 = amFilter.map(m => m['result1']).reduce((a, b) => Number(a) + Number(b), 0) 
    let pucAllPercent1 = isNaN(pcuAllResult1/pcuAllTarget1) ? 0 : Number(((pcuAllResult1/pcuAllTarget1)*100).toFixed(2))

    let pcuAllTarget2 = amFilter.map(m => m['target2']).reduce((a, b) => Number(a) + Number(b), 0) 
    let pcuAllResult2 = amFilter.map(m => m['result2']).reduce((a, b) => Number(a) + Number(b), 0) 
    let pucAllPercent2 = isNaN(pcuAllResult2/pcuAllTarget2) ? 0 : Number(((pcuAllResult2/pcuAllTarget2)*100).toFixed(2))

    let homeBedAllTarget = pcuAllTarget1 + pcuAllTarget2
    let homeBedAllResult = pcuAllResult1 + pcuAllResult2
    let homeBedAllPercent = isNaN(homeBedAllResult/homeBedAllTarget) ? 0 : Number(((homeBedAllResult/homeBedAllTarget)*100).toFixed(2))
    pcu.forEach(r=>{
      let pcufil = amFilter.filter(f=> r.substring(0, 5) == f['hospcode'])      
      if(pcufil.length > 0){
         let target1 = pcufil.map(m => m['target1']).reduce((a, b) => Number(a) + Number(b), 0) 
         let result1 = pcufil.map(m => m['result1']).reduce((a, b) => Number(a) + Number(b), 0) 
         let percent1 = isNaN(result1/target1) ? 0 : Number(((result1/target1)*100).toFixed(2))
         let target2 = pcufil.map(m => m['target2']).reduce((a, b) => Number(a) + Number(b), 0) 
         let result2 = pcufil.map(m => m['result2']).reduce((a, b) => Number(a) + Number(b), 0) 
         let percent2 = isNaN(result2/target2) ? 0 : Number(((result2/target2)*100).toFixed(2))
         let hbTarget = target1+target2
         let hbResult = result1+result2
         let hbPercent = isNaN(hbResult/hbTarget) ? 0 : Number(((hbResult/hbTarget)*100).toFixed(2))
         arr.push([
           r,
           hbTarget,
           hbResult,
           hbPercent,
           target1,
           result1,
           percent1,
           target2,
           result2,
           percent2
         ])
      }
      else{
         arr.push([ r, 0, 0, 0.00, 0, 0, 0.00, 0, 0, 0.00])
      }
   })
   arr.push([
      "รวม",
      homeBedAllTarget,
      homeBedAllResult,
      homeBedAllPercent,
      pcuAllTarget1,     
      pcuAllResult1,
      pucAllPercent1,
      pcuAllTarget2,
      pcuAllResult2,
      pucAllPercent2
    ])    
    return arr
  }

  function loadPage(){
    loadingStart()
    console.log("load page start")  
    fetch(mappcu)
    .then(response =>{      
      return response.json()        
    })
    .then(data => {    
      gMapPcu = data['data'] 
      const option = gMapPcu.map(r=> [r['ampcode'],r['ampur']])
      gAmpOption = normalize(option)

      let result = '<option disabled selected value="">เลือกอำเภอ</option>'
      gAmpOption.forEach(r=>{
        result+=  `<option  value="${r[0]}">${r[1]}</option>`
      })

      $('#ampur').html(result)
      loadingEnd()
      console.log("load page success")      
    })
    .catch(error => {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "การเชื่อมต่อผิดพลาด!",
        showConfirmButton: true,
        //timer: 1500
       });
       loadingEnd()
      console.error("Error in fetch:", error.message);      
    });
    
  }
  
  document.addEventListener('DOMContentLoaded',loadPage)
