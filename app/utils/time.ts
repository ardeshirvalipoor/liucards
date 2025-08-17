export default {
    // 'HH:MM' => '23:59'
    format(date: Date, f: string) { 
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();
        let hh = ('0' + h).slice(-2)
        let mm = ('0' + m).slice(-2)
        let ss = ('0' + s).slice(-2)
        return f.replace('HH', hh).replace('MM', mm).replace('SS', ss);
    }
}