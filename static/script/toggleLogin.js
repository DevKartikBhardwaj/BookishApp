//toggling login and logout btns
let BaseUrl = "https://bookish-8avz.onrender.com";
let scrollList = document.getElementById("scrollListPack");
if (document.cookie.indexOf("jsonwebtok") == 0) {

    scrollList.innerHTML = `  <li id="logoutBtn"><a class="sub-menu-item" id="sub-menu-item1"><i
class="fa-solid fa-right-to-bracket list-icon" style="margin-right: 0.2em;"></i>
Logout</a>
</li>

<li><a href="/dashboard/userdetails" class="sub-menu-item" id="sub-menu-item3"><i
class="fa-solid fa-user list-icon"></i>Dashboard</a>
</li>`;
}
else {
    scrollList.innerHTML = `  <li ><a  href="/login" class="sub-menu-item" id="sub-menu-item1"><i
    class="fa-solid fa-right-to-bracket list-icon" style="margin-right: 0.2em;"></i>
login</a>
</li>
<li><a href="/signup" class="sub-menu-item" id="sub-menu-item2"><i
    class="fa-solid fa-user-plus list-icon"
    style="margin-right: 0.2em;"></i>Signup</a></li>
<li><a href="/dashboard/userdetails" class="sub-menu-item" id="sub-menu-item3"><i
    class="fa-solid fa-user list-icon"></i>Dashboard</a>
</li>`;
}

let logoutBtn = document.getElementById("logoutBtn");
document.cookie.indexOf("jsonwebtok") == 0 && logoutBtn.addEventListener("click", () => {
    document.cookie.replace(
        /(?<=^|;).+?(?=\=|;|$)/g,
        name => location.hostname
            .split(/\.(?=[^\.]+\.)/)
            .reduceRight((acc, val, i, arr) => i ? arr[i] = '.' + val + acc : (arr[i] = '', arr), '')
            .map(domain => document.cookie = `${name}=;max-age=0;path=/;domain=${domain}`)
    );
    location.href = `${BaseUrl}/`
})