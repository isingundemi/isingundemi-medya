# Instagram Yorum Turu — Talimat

**Hesap:** @isingundemi (Alpay Oktay, A Sınıfı İş Güvenliği Uzmanı)
**Zamanlama:** Her gün 09:39, 13:39, 17:39, 21:39 (İstanbul saati) — günde 4 tur
**Sınır:** Her turda en fazla 5 yorum, en fazla 5 beğeni
**Tarayıcı:** ayg bilgisayarındaki Chrome (Claude in Chrome uzantısı, deviceId `ec87e54e-ad4e-466c-aaa8-644d8df24a31`)
**Bildirim:** Sorun olursa telefona bildirim; sorun yoksa sessiz

---

## Genel kurallar

- Kullanıcı bu turları onayladı; onay isteme.
- Kullanıcıya "abi" deme.

## Yasaklar

- Instagram'da başka hesaba geçme.
- Takip etme, takipten çıkma, takip isteği iptali, DM, hikâye yanıtı, paylaşım YAPMA.
- Şifre yazma, CAPTCHA çözme.

## 1) Tarayıcı bağlantısı

- Claude in Chrome araçlarını tek ToolSearch ile yükle:
  `select:mcp__claude-in-chrome__list_connected_browsers,mcp__claude-in-chrome__select_browser,mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__tabs_close_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__javascript_tool,mcp__claude-in-chrome__browser_batch,mcp__claude-in-chrome__find,mcp__claude-in-chrome__get_page_text`
- `list_connected_browsers` çağır. Listede deviceId `ec87e54e-ad4e-466c-aaa8-644d8df24a31` (ayg bilgisayarı) varsa `select_browser` ile onu seç, sorma. Yoksa ve tek tarayıcı bağlıysa onu kullan; ama Instagram'da isingundemi açık değilse dur.
- `tabs_context_mcp(createIfEmpty: true)` ile oturumun kendi sekme grubunu al; işleri o gruptaki sekmelerde yap. Kullanıcının diğer sekmelerine dokunma. İş bitince yalnızca kendi açtığın ek sekmeleri kapat.
- Açık hesabın isingundemi olduğunu doğrula (sayfada `a[href="/isingundemi/"]` bağlantısı). Değilse ya da hiçbir tarayıcıya ulaşılamıyorsa hiçbir şey yapmadan dur ve kullanıcıya tek cümle yaz.

## 2) Tekrar yorum yasağı

- https://www.instagram.com/your_activity/interactions/comments sayfasından son yorum yapılan hesapları çıkar.
- Son 7 günde yorum yapılmış hesaba yorum yapma.
- Bir gönderiye asla ikinci kez yorum yapma.

## 3) Gönderi seçimi

- Kaynak: hashtag sayfaları (`https://www.instagram.com/explore/tags/<etiket>/` — örn. işgüvenliği, işsağlığıvegüvenliği, isg, ilkyardım, mühendislik, şantiye, mersin, işçihakları) ve ana akış.
- Son 3 günde paylaşılmış, kaliteli hesapların gönderileri: kurumsal/profesyonel hesaplar, uzmanlar, mühendisler, paramedikler, kamu kurumları, sektör yayınları, yorumları canlı hesaplar.
- Gönderi bilgisi için gönderi sayfasının `og:description` meta etiketi okunabilir (beğeni, yorum, hesap, tarih, açıklama).
- Görünür ama yorum sayısı boğucu olmayan gönderileri tercih et.
- Açıklamayı tam oku; önerdiğin bilgi gönderide zaten yazıyorsa başka bir bilgi seç.

**DOKUNMA (beğenme de):**

- Siyaset, din
- Ölüm/kaza/trajedi haberleri (yayın yasağı olan olaylar dahil, örn. Aliağa patlaması)
- Reklam/sponsorlu içerik, kurs/sınav satışı, rakip OSGB ilanları
- Bireylerin kişisel/aile/selfie fotoğrafları
- Tartışmalı içerik
- "Yapay zeka tarafından oluşturulan profil" etiketli küçük hesaplar

## 4) Yorumları yapay zekâlarla tartış

- Seçilen en fazla 5 gönderi için kısa özet hazırla (hesap, konu, açıklama özeti) ve kendi taslak yorumlarını yaz.
- Aynı Chrome'da gemini.google.com ve perplexity.ai'yi (gerekirse grok.com) kendi sekmelerinde aç.
- **Tek satırlık** (satır sonu olmayan) bir mesajla sor: her gönderi için yorum yapmaya değer mi, teknik olarak doğru mu, daha iyi 1-2 cümlelik Türkçe versiyon. Satır sonu kullanma — Enter mesajı erken gönderir.
- Cevapları karşılaştır, her gönderi için tek yorumda uzlaş. Oturumlar açık değilse kendi değerlendirmenle yap ve özette belirt.

**Yorum kuralları:**

- Konuya özgü: pratik saha ipucu, az bilinen doğru bilgi ya da düşündüren kısa soru.
- Samimi ama profesyonel; jenerik övgü yok.
- Link, hashtag, kendi hesabının reklamı, "takip et" yok.
- Emin olmadığın mevzuat/sayı iddiası yazma (ör. her ekipmanda geçerli olmayan sabit sayılar).
- Önceki yorumların kalıplarını tekrarlama.
- Doğru Türkçe yazım.
- Uzlaşı yoksa yorum yapma.

## 5) Uygulama

- Gönderi sayfasında "Yorum ekle..." kutusuna tıkla, yorumu yaz, Enter ile gönder; ardından gönderinin "Beğen" düğmesine bas.
- Yorum sayısının arttığını doğrula.
- Yorumlar arasında 2–4 dakika, beğeniler arasında 15–30 saniye bekle (wait en fazla 10 sn; bir browser_batch 120 sn'yi geçmesin, beklemeleri birkaç batch'e böl).

## 6) Güvenlik

"Daha sonra tekrar dene", "Bu işlemi kısıtlıyoruz", işlem engeli, doğrulama/CAPTCHA, şifre veya şüpheli giriş ekranı görürsen hemen dur, hiçbir şeyi çözmeye çalışma, kullanıcıya kısaca yaz.

## 7) Özet

Sonunda kısa Türkçe özet: yapılan yorumlar (hesap + konu + yorum metni), beğeni sayısı, atlananlar. Sorun yoksa kullanıcıya ayrıca mesaj gönderme.
