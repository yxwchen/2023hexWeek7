let data = [];
let url = 'https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json';
axios.get(url)
    .then(function (response) {
        data = response.data.data;
        // 渲染出陣列資料
        renderC3();
        render();

    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })

const elTicketCardArea = document.querySelector('.ticketCard-area');


function render(location) {
    let str = '';
    let filterdData = [];
    // filter
    const filterData = data.filter(function (item) {
        if (location === item.area) {
            filterdData.push(item);
            return true;
        }
        // 全部地區用的 value是空值 if('')=>false
        if (!location) {
            filterdData.push(item);
            return true;
        }
    });


    // 判斷完的資料塞回str裡面
    filterData.forEach(function (item) {
        str += `
<li class="ticketCard">
                    <div class="ticketCard-img">
                        <a href="#">
                            <img src="${item.imgUrl}" alt="">
                        </a>
                        <div class="ticketCard-region">${item.area}</div>
                        <div class="ticketCard-rank">${item.rate}</div>
                    </div>
                    <div class="ticketCard-content">
                        <div>
                            <h3>
                                <a href="#" class="ticketCard-name">${item.name}</a>
                            </h3>
                            <p class="ticketCard-description">
                            ${item.description}
                            </p>
                        </div>
                        <div class="ticketCard-info">
                            <p class="ticketCard-num">
                                <span><i class="fas fa-exclamation-circle"></i></span>
                                剩下最後 <span id="ticketCard-num">${item.group} </span> 組
                            </p>
                            <p class="ticketCard-price">
                                TWD <span id="ticketCard-price">$${item.price}</span>
                            </p>
                        </div>
                    </div>
                </li>
`
    });
    elTicketCardArea.innerHTML = str;
    const elResultCount = document.querySelector('#searchResult-text');
    elResultCount.textContent = `本次搜尋共 ${filterdData.length} 筆資料`;

}
 function renderC3() {
        let totalObj = {};
        data.forEach(function (item) {
            if (totalObj[item.area] == undefined) {
                totalObj[item.area] = 1;
            } else {
                totalObj[item.area] += 1;
            }
        })
        console.log(totalObj);
        // 轉成C3要的格式，陣列資料
        let newData = [];
        let areaAry = Object.keys(totalObj);
        // console.log(areaAry);
        areaAry.forEach(function (item) {
            let ary = [];
            ary.push(item);
            ary.push(totalObj[item]);
            newData.push(ary);
        })
        console.log(newData);
        const chart = c3.generate({
            bindto: "#chart", // HTML 元素綁定
            data: {
                columns: newData, // 資料存放
                type: "donut",
                onclick: function (d, i) {
                    console.log("onclick", d, i);
                },
                onmouseover: function (d, i) {
                    console.log("onmouseover", d, i);
                },
                onmouseout: function (d, i) {
                    console.log("onmouseout", d, i);
                }
            },
            donut: {
                title: "套票地區比重"
            },
            color:{
                pattern: ["#E68618", "#F280CA", "#26BFC7", /* add more colors as needed */]
              }
        });
    }

// data.push('新增一筆');
const elAddBtn = document.querySelector('.addTicket-btn');

function addCard() {
    // 綁元素
    const elName = document.querySelector('#ticketName');
    const elImgUrl = document.querySelector('#ticketImgUrl');
    const elArea = document.querySelector('#ticketRegion');
    const elDescription = document.querySelector('#ticketDescription');
    const elGroup = document.querySelector('#ticketNum');
    const elPrice = document.querySelector('#ticketPrice');
    const elRate = document.querySelector('#ticketRate');
    // 新增一筆資料，推進data陣列裡
    data.push({
        id: Date.now(), //時間戳，唯一值識別
        name: elName.value,
        imgUrl: elImgUrl.value,
        area: elArea.value,
        description: elDescription.value,
        group: parseInt(elGroup.value),
        price: parseInt(elPrice.value),
        rate: parseInt(elRate.value)
    })
    // console.log(data);
    // 重新渲染整個列表
    render();
    renderC3();
    // 新增完清空
    const elForm = document.querySelector('.addTicket-form');
    elForm.reset();
}
elAddBtn.addEventListener('click', addCard);


// 篩選地區=============================================
// filter陣列方法
// 對陣列內的值做篩選
// 會產生新陣列，所以可以用變數接收return的結果
// let array = [1, 2, 4, 6];
// let newArray = array.filter(function (item) {
//     return item !== 6;
// });
// console.log(newArray); //[1,2,4]
const elRegionSearch = document.querySelector('.regionSearch');
elRegionSearch.addEventListener('change', filter);

function filter() {
    console.log(elRegionSearch.value);
    render(elRegionSearch.value);
}