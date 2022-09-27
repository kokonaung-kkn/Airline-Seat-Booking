document.body.onload=async()=>{
    let basket = await(await fetch('/static/json/basket.json')).json();
    let seats = await(await fetch('/static/json/seatsOut.json')).json();
    let geography = await(await fetch('/static/json/geography.json')).json();

    //Calculate the total fare frm the basket
    let totalPassenger = basket.Passengers.length
    let outfare = basket.JourneyPairs[0].OutboundSlot.Flight.FlightFares[0].Prices.Adult.Price;
    let retfare = basket.JourneyPairs[0].ReturnSlot.Flight.FlightFares[0].Prices.Adult.Price;
    let outtax = basket.JourneyPairs[0].OutboundSlot.Flight.FlightTaxes.TaxAmount
    let rettax = basket.JourneyPairs[0].ReturnSlot.Flight.FlightTaxes.TaxAmount
    let total = (outfare+retfare) * totalPassenger;
    let totaltax = (outtax+rettax) * totalPassenger

    document.getElementById('air-fare').innerHTML = `£${(total-totaltax).toFixed(2)}`
    document.getElementById('taxes').innerHTML = `£${totaltax}`
    document.getElementById('total-seats').innerHTML = `£0`
    document.getElementById('total-basket').innerHTML = `£${total.toFixed(2)}`
    document.getElementById('basketTotal').innerText = `Basket £${total.toFixed(2)}`;

    //Find outbound flight details
    let departAirport = basket.JourneyPairs[0].OutboundSlot.Flight.DepartureIata;
    let arriveAirport = basket.JourneyPairs[0].OutboundSlot.Flight.ArrivalIata;
    let depart = basket.JourneyPairs[0].OutboundSlot.Flight.LocalDepartureTime

    out_date = dateConverter(depart)

    let airports = geography.Airports
    let outAirports = nameConverter(departAirport,arriveAirport,airports)
    let outboundPrice = basket.JourneyPairs[0].OutboundSlot.Flight.FlightFares[0].Prices.Adult.Price

    document.getElementById('t-info').innerHTML = `${departAirport} to ${arriveAirport}, ${out_date[1]} ${out_date[2]} ${out_date[3]}`
    
    document.getElementById('outbound').innerHTML = `
    <div style='margin-bottom: 15px'>
        <h5 style='margin-bottom: 8px'>${outAirports[0]} to ${outAirports[1]}</h5>
        <div style='color: #57ffd5'>${basket.JourneyPairs[0].OutboundSlot.Flight.CarrierCode}${basket.JourneyPairs[0].OutboundSlot.Flight.FlightNumber} <i class="uil uil-plane"></i></div>
        <div style='color: #57ffd5'>Departure: ${out_date[0]} ${out_date[1]} ${out_date[2]} ${out_date[3]}</div>
        <div style='color: #57ffd5'>Arrival: ${basket.JourneyPairs[0].OutboundSlot.Flight.LocalArrivalTime.substring(11,16)}</div>
    </div>
    <div style='margin-bottom: 15px'>
        <h5 style='margin-bottom: 8px'>Your fares</h5>
        <div class='fares' style='color: #57ffd5'><span>Adult</span><span>${totalPassenger} x £${outboundPrice}<span></div>
    </div>
    <div style='margin-bottom: 15px'>
        <h5 style='margin-bottom: 8px'>Your flight options</h5>
        <div class='seat_select' id='seat_select' style='color: #57ffd5'><span>You have not selected seats yet</span><span><span></div>
    </div>
    <div>
        <h5 style='margin-bottom: 8px'>Your cabin bags</h5>
        <div class='bags' style='color: #57ffd5'><span>Small cabin bag</span><span>${totalPassenger} x included<span></div>
    </div>
    `;

    //Find return flight details
    let rDepartAirport = basket.JourneyPairs[0].ReturnSlot.Flight.DepartureIata;
    let rArriveAirport = basket.JourneyPairs[0].ReturnSlot.Flight.ArrivalIata;
    let rDepart = basket.JourneyPairs[0].ReturnSlot.Flight.LocalDepartureTime

    return_date = dateConverter(rDepart)

    let returnAirports = nameConverter(rDepartAirport,rArriveAirport,airports)
    let returnPrice = basket.JourneyPairs[0].ReturnSlot.Flight.FlightFares[0].Prices.Adult.Price

    document.getElementById('return').innerHTML = `
    <div style='margin-bottom: 15px'>
        <h5 style='margin-bottom: 8px'>${returnAirports[0]} to ${returnAirports[1]}</h5>
        <div style='color: #57ffd5'>${basket.JourneyPairs[0].ReturnSlot.Flight.CarrierCode}${basket.JourneyPairs[0].ReturnSlot.Flight.FlightNumber} <i class="uil uil-plane"></i></div>
        <div style='color: #57ffd5'>Departure: ${return_date[0]} ${return_date[1]} ${return_date[2]} ${return_date[3]}</div>
        <div style='color: #57ffd5'>Arrival: ${basket.JourneyPairs[0].ReturnSlot.Flight.LocalArrivalTime.substring(11,16)}</div>
    </div>
    <div style='margin-bottom: 15px'>
        <h5 style='margin-bottom: 8px'>Your fares</h5>
        <div class='fares' style='color: #57ffd5'><span>Adult</span><span>${totalPassenger} x £${returnPrice}<span></div>
    </div>
    <div style='margin-bottom: 15px'>
        <h5 style='margin-bottom: 8px'>Your flight options</h5>
        <div class='fares' style='color: #57ffd5'><span>You have not selected seats yet</span><span><span></div>
    </div>
    <div style='margin-bottom: 15px'>
        <h5 style='margin-bottom: 8px'>Your cabin bags</h5>
        <div class='fares' style='color: #57ffd5'><span>Small cabin bag</span><span>${totalPassenger} x included<span></div>
    </div>
    `;

    //passenger 
    for(let i=0; i<totalPassenger; i++){
        let pas = document.getElementById('passenger')
        let adultBox = document.createElement('div')
        let adult = document.createElement('div')
        let right = document.createElement('i')
        let user = document.createElement('i')
        let span = document.createElement('span')
        adultBox.classList.add('adultBox')
        adultBox.setAttribute('id',`adult${i+1}`)
        adult.classList.add('adult')
        if (i==0){
            adultBox.classList.add('active')
        }
        right.classList.add('uil','uil-caret-right')
        user.classList.add('uil','uil-user')
        span.innerHTML = `Adult ${i+1}`

        let seat = document.createElement('span')
        seat.classList.add('seat_no')
        adult.append(right,user,span)
        adultBox.append(adult)
        adultBox.append(seat)
        pas.append(adultBox)
    }

    //passenger selection
    if(totalPassenger==2){
        document.getElementById('adult1').firstChild.onclick = () => {
            if(document.getElementById('adult1').nextSibling.classList.contains('active')){
                document.getElementById('adult1').nextSibling.classList.remove('active')
                document.getElementById('adult1').classList.add('active')
            }
        }
    
        document.getElementById('adult2').firstChild.onclick = () => {
            if(document.getElementById('adult2').previousSibling.classList.contains('active')){
                document.getElementById('adult2').previousSibling.classList.remove('active')
                document.getElementById('adult2').classList.add('active')
            }
        }
    }

    // Seats position
    price = 0
    current = 0
    for(let r=0; r<seats.Rows.length; r++){
        let rowNumber = seats.Rows[r].RowNumber
        let row = document.createElement('div')
        row.classList.add('seat_row')
        for(let b=0; b<seats.Rows[r].Blocks.length; b++){
            let block = document.createElement('div')
            block.classList.add('block')
            for(let s=0; s<seats.Rows[r].Blocks[b].Seats.length; s++){
                let seat = document.createElement('div')
                seat.setAttribute('id',seats.Rows[r].Blocks[b].Seats[s].SeatNumber)
                price = seats.Rows[r].Blocks[b].Seats[s].Price
                priceBand = seats.Rows[r].Blocks[b].Seats[s].PriceBand
                seat.setAttribute('price', price)
                seat.setAttribute('band', priceBand)
                seat.setAttribute('title',seats.Rows[r].Blocks[b].Seats[s].SeatNumber)
                if(seats.Rows[r].Blocks[b].Seats[s].IsAvailable){
                    seat.classList.add('seat','available')
                }else{
                    seat.classList.add('seat','unavailable')
                }
                block.append(seat)
            }
            row.append(block)
        }
        let span = document.createElement('span')
        span.innerHTML = rowNumber
        row.insertBefore(span, row.lastChild);
        if(price!=current){
            let div = document.createElement('div')
            div.classList.add('price')
            div.innerHTML = `Price - ${price}`
            document.getElementById('plane').append(div)
            current = price
        }
        document.getElementById('plane').append(row)
    }

    // Seat Selection
    let priceList = []
    document.querySelectorAll('.seat').forEach(s => {
        s.onclick = ()=>{
            if(!s.classList.contains('unavailable')){
                if(s.classList.contains('occupied')){
                    let id= s.getAttribute('id')
                    s.classList.remove('occupied')
                    pass = s.classList[2]
                    s.classList.remove(pass)
                    document.getElementById(pass).lastChild.innerHTML = ''
                    if(pass == 'adult1'){
                        document.getElementById(pass).classList.add('active')
                        if(totalPassenger > 1){
                            document.getElementById(pass).nextSibling.classList.remove('active')
                        }
                    }else{
                        document.getElementById(pass).classList.add('active')
                        document.getElementById(pass).previousSibling.classList.remove('active')
                    }
                    document.getElementById(pass).classList.remove(id)
                }
                else{
                    seatNum = s.getAttribute('id')
                    document.querySelectorAll('.adultBox').forEach(a => {
                        if(a.classList.contains('active')){
                            id = a.getAttribute('id')                        
                        }
                    })
                    activePass = document.getElementById(id)
                    if(activePass.classList.length == 3){
                        if(totalPassenger==1){
                            oldseat = activePass.classList[2]
                        }else{
                            oldseat = activePass.classList[1]
                        }
                        document.getElementById(oldseat).classList.remove('occupied')
                        activePass.classList.remove(oldseat)
                    }
                    activePass.classList.add(seatNum)
                    activePass.lastChild.innerHTML = `${seatNum} <i class="uil uil-trash-alt"></i>`
                    s.classList.add('occupied',id)
                    if(totalPassenger==2){
                        if(id == 'adult1'){
                            activePass.classList.remove('active')
                            activePass.nextSibling.classList.add('active')
                        }
                        else{
                            document.getElementById('adult2').classList.remove('active')
                            document.getElementById('adult2').classList.add('active')
                        }
                    }
                    seatPrice = s.getAttribute('price')
                    seatBand = s.getAttribute('band')
                }
                priceList[seatNum] = [seatPrice,seatBand]
                totalPrice(priceList,total,totalPassenger)
            }
        }
    }) 

    // Delete Button
    document.querySelectorAll('.seat_no').forEach(s => {
        s.onclick = () => {
            if(s.parentElement.classList.contains('active')){
                if(totalPassenger==1){
                    no = s.parentElement.classList[2]
                }
                else{
                    no = s.parentElement.classList[1]
                }
                s.parentElement.classList.remove(no)
                s.innerHTML = ''
                let occupied = document.getElementById(no).classList[2]
                let pass = document.getElementById(no).classList[3]
                document.getElementById(no).classList.remove(occupied,pass)
                totalPrice(priceList,total,totalPassenger)
            }
        }
    })

    document.querySelectorAll('#skip').forEach(btn => {
        btn.onclick = () => {
            if(document.getElementById('adult1').classList.contains('active')){
                if(totalPassenger > 1){
                    document.getElementById('adult1').classList.remove('active')
                    document.getElementById('adult2').classList.add('active')
                }
            }
        }
    })
}

function nameConverter(short_depart,short_arrive,airports){
    for(let i=0; i<airports.length; i++){
        if(airports[i].Iata == short_depart){
            long_depart = airports[i].Name
        }
        else if(airports[i].Iata == short_arrive){
            long_arrive = airports[i].Name
        }
    }
    let airportNames = [long_depart,long_arrive]
    return airportNames
}

function dateConverter(trip){
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let date = new Date(trip)
    let dtime = trip.substring(11,16)
    let dday = days[date.getDay(trip)]
    let date1 = ddate(date.getDate(trip))
    let dmonth = months[date.getMonth(trip)]
    date_data = [dtime, dday, date1, dmonth]
    return date_data
}

function ddate(d) {
    if (d == 1){
        return d+'st'
    }
    else if (d == 2){
        return d+'nd'
    }
    else if (d == 3){
        return d+'rd'
    }
    else if (d > 3){
        return d+'th'
    }
}

function totalPrice(priceList,total,totalPassenger){
    outbound_seat = ''
    s_price = 0
    totalLoop = 0
    for(let s_no in priceList){
        if(document.getElementById(s_no).classList.contains('occupied')){
            bandName = priceList[s_no][1] ? priceList[s_no][1] : 'Standard'
            outbound_seat += `
            <div><span>${bandName} Seat: ${s_no}</span><span>£${priceList[s_no][0]}</span></div>
            `
            s_price += parseFloat(priceList[s_no])
            totalLoop += 1
        }
    }

    final = total+s_price

    document.getElementById('total-seats').innerHTML = `£${s_price}`
    document.getElementById('total-basket').innerHTML = `£${final.toFixed(2)}`

    if(totalLoop == 0){
        document.getElementById('seat_select').innerHTML = 'You have not selected seats yet'
    }else{
        document.getElementById('seat_select').innerHTML = outbound_seat
    }

    document.getElementById('basketTotal').innerText = `Basket £${final.toFixed(2)}`;
    if(totalLoop == totalPassenger){
        document.querySelectorAll('#skip').forEach(btn => {
            btn.style.display = 'none'
        })
        document.querySelectorAll('#continue').forEach(btn => {
            btn.style.display = 'block'
        })
    }else{
        document.querySelectorAll('#skip').forEach(btn => {
            btn.style.display = 'block'
        })
        document.querySelectorAll('#continue').forEach(btn => {
            btn.style.display = 'none'
        })
    }
}
