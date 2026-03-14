import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { cardOccasions, cardTemplates } from '../create/card-templates'
import { getCardData } from '../../utils/cardShare'
import styles from './CardSharePage.module.css'

/* ─── SHARED MEDIA BLOCK ─── */
function MediaBlock({ media, style }) {
  if (!media || media.length === 0) return null;
  const radius = style === "polaroid" ? "2px" : "10px";
  return (
    <div style={{ marginBottom:"1.25rem", display:"flex", flexDirection:"column", gap:"0.625rem" }}>
      {media.map((item, i) => (
        <div key={`${item.type}-${i}`} style={{ display:"flex", justifyContent:"center" }}>
          {item.type === "image" && (
            <img src={item.url} alt="Uploaded" style={{ maxHeight:200, objectFit:"cover", borderRadius:radius, boxShadow:"0 4px 16px rgba(0,0,0,0.10)" }} />
          )}
          {item.type === "video" && (
            <video src={item.url} controls style={{ maxHeight:200, borderRadius:radius, boxShadow:"0 4px 16px rgba(0,0,0,0.10)" }} />
          )}
          {item.type === "audio" && (
            <audio src={item.url} controls style={{ width:"100%" }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── CARD RENDER (Matches CardPreview exactly) ─── */
function CardRender({ template, recipientName, senderName, message, occasion, media, customColor }) {
  const bg     = customColor ? customColor.bg     : template.bgColor;
  const text   = customColor ? customColor.text   : template.textColor;
  const accent = customColor ? customColor.accent : template.accentColor;
  const badgeBg   = customColor ? customColor.accent      : template.badgeColor;
  const badgeText = customColor ? "#ffffff"                : template.badgeTextColor;
  const name   = recipientName || "You";
  const sender = senderName    || "Someone special";
  const msg    = message       || "A heartfelt message was shared with you.";

  const wrap = {
    position: "relative",
    width: "100%",
    maxWidth: "430px",
    fontFamily: "inherit",
  };

  /* ═══════════════════════════════
     CLASSIC  — warm parchment elegance
  ═══════════════════════════════ */
  if (template.style === "classic") {
    return (
      <div style={wrap}>
        {/* Soft ambient glow behind the card */}
        <div style={{ position:"absolute", inset:"1rem", borderRadius:"1.5rem", opacity:0.14, filter:"blur(48px)", background:accent, pointerEvents:"none" }} />

        <div
          style={{ position:"relative", background:bg, borderRadius:"24px", minHeight:500, overflow:"hidden",
            boxShadow:"0 24px 64px rgba(0,0,0,0.11), 0 6px 20px rgba(0,0,0,0.06)" }}
        >
          {/* Corner bracket ornaments */}
          <div style={{ position:"absolute", top:18, left:18, width:44, height:44, borderTop:`2px solid ${accent}`, borderLeft:`2px solid ${accent}`, borderRadius:"8px 0 0 0", opacity:0.28, pointerEvents:"none" }} />
          <div style={{ position:"absolute", top:18, right:18, width:44, height:44, borderTop:`2px solid ${accent}`, borderRight:`2px solid ${accent}`, borderRadius:"0 8px 0 0", opacity:0.28, pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:18, left:18, width:44, height:44, borderBottom:`2px solid ${accent}`, borderLeft:`2px solid ${accent}`, borderRadius:"0 0 0 8px", opacity:0.28, pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:18, right:18, width:44, height:44, borderBottom:`2px solid ${accent}`, borderRight:`2px solid ${accent}`, borderRadius:"0 0 8px 0", opacity:0.28, pointerEvents:"none" }} />

          {/* Large decorative quotation marks */}
          <div style={{ position:"absolute", right:"1.75rem", top:"3.5rem", fontSize:"7rem", lineHeight:1, color:accent, opacity:0.06, fontFamily:"Georgia,serif", userSelect:"none", pointerEvents:"none" }}>&ldquo;</div>
          <div style={{ position:"absolute", left:"1.25rem", bottom:"3.5rem", fontSize:"7rem", lineHeight:1, color:accent, opacity:0.06, fontFamily:"Georgia,serif", userSelect:"none", pointerEvents:"none" }}>&rdquo;</div>

          <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", minHeight:500, padding:"2.25rem 2rem" }}>
            {/* Occasion badge */}
            <div style={{ display:"flex", justifyContent:"center", marginBottom:"1.25rem" }}>
              <span style={{ display:"inline-flex", alignItems:"center", gap:"5px", padding:"5px 14px", borderRadius:"999px", fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", background:badgeBg, color:badgeText, boxShadow:`0 3px 12px ${accent}35` }}>
                {occasion.emoji} {occasion.label}
              </span>
            </div>

            {/* Recipient */}
            <h2 style={{ textAlign:"center", fontSize:"1.9rem", fontWeight:700, color:text, fontFamily:template.fontFamily, margin:"0 0 1.25rem", lineHeight:1.2 }}>
              Dear {name}
            </h2>

            <MediaBlock media={media} />

            {/* Message */}
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"0.5rem 0" }}>
              <p style={{ textAlign:"center", fontSize:"1rem", lineHeight:1.85, fontStyle:"italic", color:text, fontFamily:template.messageFontFamily, margin:0 }}>
                {msg}
              </p>
            </div>

            {/* Signature */}
            <div style={{ marginTop:"1.5rem", textAlign:"center" }}>
              <div style={{ width:44, height:1, background:accent, opacity:0.28, margin:"0 auto 10px" }} />
              <p style={{ fontSize:"9px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.32em", color:accent, margin:"0 0 5px" }}>With Love,</p>
              <p style={{ fontSize:"1.375rem", fontWeight:700, color:text, fontFamily:template.fontFamily, margin:0 }}>{sender}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════
     MINIMAL  — editorial precision
  ═══════════════════════════════ */
  if (template.style === "minimal") {
    return (
      <div style={wrap}>
        <div
          style={{ position:"relative", background:bg, borderRadius:"3px", minHeight:490, overflow:"hidden",
            border:`1px solid ${accent}1a`, boxShadow:"0 8px 40px rgba(0,0,0,0.07)" }}
        >
          {/* Top accent line */}
          <div style={{ height:3, width:"100%", background:accent }} />

          <div style={{ display:"flex", flexDirection:"column", minHeight:480, padding:"2.25rem 2.5rem" }}>
            <span style={{ fontSize:"9px", fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", color:accent, marginBottom:"8px" }}>
              {occasion.emoji} {occasion.label}
            </span>

            <h2 style={{ fontSize:"2.25rem", fontWeight:300, letterSpacing:"-0.025em", color:text, fontFamily:template.fontFamily, margin:"0 0 2rem", lineHeight:1.2 }}>
              To {name}
            </h2>

            <MediaBlock media={media} style="minimal" />

            <div style={{ flex:1 }}>
              <p style={{ fontSize:"0.9375rem", lineHeight:1.9, color:text, fontFamily:template.messageFontFamily, margin:0 }}>
                {msg}
              </p>
            </div>

            <div style={{ marginTop:"2rem", paddingTop:"1.25rem", borderTop:`1px solid ${accent}18`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:"9px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.22em", color:accent }}>With love</span>
              <span style={{ fontSize:"1.125rem", fontWeight:500, color:text, fontFamily:template.fontFamily }}>{sender}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════
     HANDWRITTEN  — notebook warmth
  ═══════════════════════════════ */
  if (template.style === "handwritten") {
    return (
      <div style={wrap}>
        <div
          style={{ position:"relative", background:bg, minHeight:490, overflow:"hidden",
            boxShadow:"0 12px 44px rgba(0,0,0,0.10), 0 3px 10px rgba(0,0,0,0.06)", transform:"rotate(-0.5deg)" }}
        >
          {/* Ruled lines overlay */}
          <div style={{ position:"absolute", inset:0, pointerEvents:"none",
            backgroundImage:`repeating-linear-gradient(transparent, transparent 31px, ${accent}18 31px, ${accent}18 32px)`,
            backgroundPosition:"0 60px" }} />

          {/* Red margin line */}
          <div style={{ position:"absolute", left:52, top:0, bottom:0, width:1.5, background:"#e74c3c", opacity:0.18, pointerEvents:"none" }} />

          {/* Left binding strip with ring holes */}
          <div style={{ position:"absolute", left:0, top:0, bottom:0, width:44, background:`${accent}06`, pointerEvents:"none" }}>
            {[60, 140, 220, 300].map((yPos) => (
              <div key={yPos} style={{ position:"absolute", top:yPos, left:"50%", transform:"translateX(-50%)",
                width:11, height:11, borderRadius:"50%", border:"1.5px solid rgba(0,0,0,0.13)", background:"rgba(255,255,255,0.55)" }} />
            ))}
          </div>

          <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", minHeight:490, padding:"2.25rem 1.75rem 2.25rem 3.75rem" }}>
            <span style={{ fontSize:"11px", color:accent, marginBottom:"4px", fontFamily:template.messageFontFamily }}>
              {occasion.emoji} {occasion.label}
            </span>

            <h2 style={{ fontSize:"1.75rem", fontWeight:700, fontStyle:"italic", color:text, fontFamily:template.fontFamily, margin:"0 0 1.25rem", lineHeight:1.25 }}>
              Dear {name},
            </h2>

            <MediaBlock media={media} />

            <div style={{ flex:1 }}>
              <p style={{ fontSize:"1rem", lineHeight:2.1, fontStyle:"italic", color:text, fontFamily:template.messageFontFamily, margin:0 }}>
                {msg}
              </p>
            </div>

            <div style={{ marginTop:"1.5rem" }}>
              <p style={{ fontSize:"9px", textTransform:"uppercase", letterSpacing:"0.18em", color:accent, margin:"0 0 4px" }}>With love,</p>
              <p style={{ fontSize:"1.5rem", fontWeight:700, fontStyle:"italic", color:text, fontFamily:template.fontFamily, margin:0 }}>
                {sender} ♡
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════
     POLAROID  — photo-first memory
  ═══════════════════════════════ */
  if (template.style === "polaroid") {
    const imgItem = media.find((m) => m.type === "image");
    return (
      <div style={wrap}>
        <div
          style={{ position:"relative", background:bg, borderRadius:"2px", minHeight:530, overflow:"hidden",
            boxShadow:"0 24px 60px rgba(0,0,0,0.16), 0 6px 16px rgba(0,0,0,0.08)", transform:"rotate(0.8deg)" }}
        >
          {/* Photo frame */}
          <div style={{ margin:"18px 18px 0", overflow:"hidden", borderRadius:"2px", background:"#f0e8d8",
            aspectRatio:"4/3", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {imgItem ? (
              <img src={imgItem.url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            ) : (
              <span style={{ fontSize:"3.5rem", lineHeight:1 }}>{occasion.emoji}</span>
            )}
          </div>

          <div style={{ padding:"1rem 1.25rem 1.75rem", display:"flex", flexDirection:"column" }}>
            <span style={{ alignSelf:"flex-start", display:"inline-block", padding:"3px 10px", borderRadius:"999px",
              fontSize:"9px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase",
              background:badgeBg, color:badgeText, marginBottom:"0.625rem" }}>
              {occasion.label}
            </span>

            <h2 style={{ fontSize:"1.375rem", fontWeight:700, color:text, fontFamily:template.fontFamily, margin:"0 0 0.625rem", lineHeight:1.3 }}>
              Dear {name} ♡
            </h2>

            {media.filter((m) => m.type !== "image").length > 0 && (
              <MediaBlock media={media.filter((m) => m.type !== "image")} style="polaroid" />
            )}

            <p style={{ fontSize:"0.875rem", lineHeight:1.75, color:text, fontFamily:template.messageFontFamily, margin:"0 0 1rem", flex:1 }}>
              {msg}
            </p>

            <p style={{ textAlign:"right", fontSize:"1.0625rem", color:accent,
              fontFamily:"'Dancing Script','Segoe Script','Brush Script MT',cursive", lineHeight:1.2, margin:0 }}>
              — {sender}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════
     NEON  — cyberpunk glow
  ═══════════════════════════════ */
  if (template.style === "neon") {
    const glowCyan  = customColor ? customColor.accent : "#00FFF0";
    const glowPink  = customColor ? customColor.accent : "#FF006E";
    const bgFinal   = customColor ? customColor.bg     : "#05050F";
    const textFinal = customColor ? customColor.text   : "#E8F4FF";
    return (
      <div style={wrap}>
        <div
          style={{
            position:"relative", background:bgFinal, minHeight:510, overflow:"hidden",
            borderRadius:"12px", border:`1px solid ${glowCyan}28`,
            boxShadow:`0 0 50px ${glowCyan}18, 0 0 100px ${glowPink}12, 0 24px 60px rgba(0,0,0,0.65)`,
          }}
        >
          {/* Scanlines */}
          <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0,
            backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.012) 3px,rgba(255,255,255,0.012) 4px)" }} />
          {/* Top neon bar */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:2, zIndex:1,
            background:`linear-gradient(90deg,transparent,${glowCyan},${glowPink},transparent)`,
            boxShadow:`0 0 18px ${glowCyan}` }} />
          {/* Bottom neon bar */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, zIndex:1,
            background:`linear-gradient(90deg,transparent,${glowPink},${glowCyan},transparent)`,
            boxShadow:`0 0 18px ${glowPink}` }} />
          {/* Tech corner brackets */}
          <div style={{ position:"absolute", top:14, left:14,  width:22, height:22, zIndex:1, borderTop:`2px solid ${glowCyan}`, borderLeft:`2px solid ${glowCyan}` }} />
          <div style={{ position:"absolute", top:14, right:14, width:22, height:22, zIndex:1, borderTop:`2px solid ${glowPink}`, borderRight:`2px solid ${glowPink}` }} />
          <div style={{ position:"absolute", bottom:14, left:14,  width:22, height:22, zIndex:1, borderBottom:`2px solid ${glowPink}`, borderLeft:`2px solid ${glowPink}` }} />
          <div style={{ position:"absolute", bottom:14, right:14, width:22, height:22, zIndex:1, borderBottom:`2px solid ${glowCyan}`, borderRight:`2px solid ${glowCyan}` }} />

          <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", minHeight:510, padding:"2rem 1.75rem" }}>
            <div style={{ marginBottom:"1.25rem", display:"flex", justifyContent:"center" }}>
              <span style={{ display:"inline-flex", alignItems:"center", gap:"5px",
                padding:"4px 14px", borderRadius:"999px", fontSize:"10px", fontWeight:700,
                letterSpacing:"0.15em", textTransform:"uppercase",
                background:glowPink, color:"#fff", boxShadow:`0 0 22px ${glowPink}70` }}>
                {occasion.emoji} {occasion.label}
              </span>
            </div>
            <h2 style={{ textAlign:"center", fontSize:"2rem", fontWeight:800,
              color:glowCyan, fontFamily:template.fontFamily, margin:"0 0 1.25rem", lineHeight:1.2,
              textShadow:`0 0 28px ${glowCyan}80, 0 0 54px ${glowCyan}40`, letterSpacing:"-0.02em" }}>
              {name}
            </h2>
            <MediaBlock media={media} />
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"0.5rem 0" }}>
              <p style={{ textAlign:"center", fontSize:"0.9rem", lineHeight:1.8, color:textFinal,
                fontFamily:template.messageFontFamily, margin:0,
                borderLeft:`2px solid ${glowCyan}35`, paddingLeft:"0.875rem" }}>
                {msg}
              </p>
            </div>
            <div style={{ marginTop:"1.5rem", paddingTop:"1rem", borderTop:`1px solid ${glowCyan}18`,
              display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:"9px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.2em", color:glowCyan }}>FROM</span>
              <span style={{ fontSize:"1.125rem", fontWeight:700, color:glowCyan,
                fontFamily:template.fontFamily, textShadow:`0 0 18px ${glowCyan}60` }}>{sender}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════
     VINTAGE  — timeworn postcard
  ═══════════════════════════════ */
  if (template.style === "vintage") {
    const bgFinal     = customColor ? customColor.bg     : "#F5E6C8";
    const textFinal   = customColor ? customColor.text   : "#3D2B1F";
    const accentFinal = customColor ? customColor.accent : "#8B4513";
    return (
      <div style={wrap}>
        <div
          style={{
            position:"relative", background:bgFinal, minHeight:510, overflow:"hidden",
            border:`8px solid rgba(139,69,19,0.10)`, outline:`1.5px solid ${accentFinal}18`,
            boxShadow:`0 14px 50px rgba(91,41,0,0.20), 0 4px 12px rgba(0,0,0,0.08)`,
          }}
        >
          {/* Aged vignette overlay */}
          <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0,
            backgroundImage:`radial-gradient(ellipse at 15% 0%,rgba(139,69,19,0.07) 0%,transparent 55%), radial-gradient(ellipse at 85% 100%,rgba(139,69,19,0.09) 0%,transparent 55%)` }} />
          {/* Double inner border */}
          <div style={{ position:"absolute", inset:10, border:`1px solid ${accentFinal}22`, pointerEvents:"none", zIndex:1 }} />
          <div style={{ position:"absolute", inset:16, border:`1px solid ${accentFinal}12`, pointerEvents:"none", zIndex:1 }} />
          {/* Corner ornament stars */}
          <div style={{ position:"absolute", top:18, left:18, fontSize:"14px", color:`${accentFinal}40`, userSelect:"none", pointerEvents:"none", zIndex:2, lineHeight:1 }}>✦</div>
          <div style={{ position:"absolute", top:18, right:18, fontSize:"14px", color:`${accentFinal}40`, userSelect:"none", pointerEvents:"none", zIndex:2, lineHeight:1 }}>✦</div>
          <div style={{ position:"absolute", bottom:18, left:18, fontSize:"14px", color:`${accentFinal}40`, userSelect:"none", pointerEvents:"none", zIndex:2, lineHeight:1 }}>✦</div>
          <div style={{ position:"absolute", bottom:18, right:18, fontSize:"14px", color:`${accentFinal}40`, userSelect:"none", pointerEvents:"none", zIndex:2, lineHeight:1 }}>✦</div>
          {/* Postal header */}
          <div style={{ position:"relative", zIndex:3, padding:"0.875rem 1.375rem 0.625rem",
            borderBottom:`1px dashed ${accentFinal}28`,
            display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:"9px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.22em",
              color:`${accentFinal}65`, fontFamily:"'Courier New',monospace" }}>
              PERSONAL CORRESPONDENCE
            </span>
            <span style={{ display:"inline-block", padding:"2px 8px",
              border:`1.5px solid ${accentFinal}45`, fontSize:"9px", fontWeight:700,
              textTransform:"uppercase", letterSpacing:"0.1em", color:accentFinal,
              transform:"rotate(-2deg)" }}>
              {occasion.label}
            </span>
          </div>
          <div style={{ position:"relative", zIndex:3, display:"flex", flexDirection:"column", padding:"1.125rem 1.375rem 1.5rem" }}>
            <h2 style={{ fontSize:"1.625rem", fontWeight:700, color:textFinal, fontFamily:template.fontFamily, margin:"0 0 0.875rem", lineHeight:1.3 }}>
              My dearest {name},
            </h2>
            <MediaBlock media={media} />
            <p style={{ fontSize:"0.875rem", lineHeight:2.0, color:textFinal, fontFamily:template.messageFontFamily, margin:"0 0 1.25rem", flex:1 }}>
              {msg}
            </p>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
              <div style={{ width:42, height:42, borderRadius:"50%",
                background:`radial-gradient(circle at 35% 35%, ${accentFinal}EE, ${accentFinal}88)`,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:`0 4px 12px ${accentFinal}40`, fontSize:"18px" }}>
                {occasion.emoji}
              </div>
              <div style={{ textAlign:"right" }}>
                <p style={{ fontSize:"9px", textTransform:"uppercase", letterSpacing:"0.15em",
                  color:`${accentFinal}75`, margin:"0 0 3px", fontFamily:"'Courier New',monospace" }}>
                  Yours sincerely,
                </p>
                <p style={{ fontSize:"1.25rem", fontStyle:"italic", fontWeight:700, color:textFinal, fontFamily:template.fontFamily, margin:0 }}>
                  {sender}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════
     GRADIENT  — vivid & modern
  ═══════════════════════════════ */
  if (template.style === "gradient") {
    const gradBg    = customColor
      ? `linear-gradient(135deg, ${customColor.bg}, ${customColor.accent}88)`
      : "linear-gradient(135deg, #667EEA 0%, #764BA2 32%, #F64F59 68%, #C471ED 100%)";
    const textFinal = customColor ? customColor.text   : "#FFFFFF";
    const goldLine  = customColor ? customColor.accent : "#FFD700";
    return (
      <div style={wrap}>
        <div
          style={{ position:"relative", background:gradBg, minHeight:520, overflow:"hidden",
            borderRadius:"20px", boxShadow:"0 30px 80px rgba(102,126,234,0.35), 0 10px 30px rgba(0,0,0,0.15)" }}
        >
          {/* Bokeh blobs */}
          <div style={{ position:"absolute", width:180, height:180, borderRadius:"50%",
            background:"rgba(255,255,255,0.08)", top:-50, right:-40,
            filter:"blur(22px)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", width:120, height:120, borderRadius:"50%",
            background:"rgba(255,255,255,0.06)", bottom:20, left:-30,
            filter:"blur(16px)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", width:80, height:80, borderRadius:"50%",
            background:"rgba(255,215,0,0.12)", top:"40%", left:"60%",
            filter:"blur(12px)", pointerEvents:"none" }} />
          {/* Frosted glass panel */}
          <div style={{ position:"relative", zIndex:1, margin:"1.375rem",
            borderRadius:"14px",
            background:"rgba(255,255,255,0.13)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
            border:"1px solid rgba(255,255,255,0.22)",
            padding:"1.625rem", display:"flex", flexDirection:"column",
            boxShadow:"inset 0 1px 0 rgba(255,255,255,0.2)" }}>
            <div style={{ marginBottom:"0.875rem", display:"flex", justifyContent:"center" }}>
              <span style={{ display:"inline-flex", alignItems:"center", gap:"5px",
                padding:"4px 13px", borderRadius:"999px",
                fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase",
                background:"rgba(255,255,255,0.22)", color:textFinal,
                border:"1px solid rgba(255,255,255,0.3)" }}>
                {occasion.emoji} {occasion.label}
              </span>
            </div>
            <h2 style={{ textAlign:"center", fontSize:"2rem", fontWeight:800, color:textFinal,
              fontFamily:template.fontFamily, margin:"0 0 1.125rem", lineHeight:1.2,
              textShadow:"0 2px 8px rgba(0,0,0,0.2)" }}>
              For {name}
            </h2>
            <MediaBlock media={media} />
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <p style={{ textAlign:"center", fontSize:"0.9375rem", lineHeight:1.85, color:textFinal,
                fontFamily:template.messageFontFamily, margin:0,
                textShadow:"0 1px 3px rgba(0,0,0,0.15)" }}>
                {msg}
              </p>
            </div>
            <div style={{ width:40, height:2, background:goldLine, margin:"1.125rem auto 0.875rem",
              borderRadius:2, boxShadow:`0 0 12px ${goldLine}80` }} />
            <p style={{ textAlign:"center", fontSize:"1.125rem", fontWeight:700, color:textFinal,
              fontFamily:template.fontFamily, margin:0,
              textShadow:"0 2px 8px rgba(0,0,0,0.2)" }}>
              — {sender}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════
     BOLD  — typographic statement (default)
  ═══════════════════════════════ */
  return (
    <div style={wrap}>
      <div
        style={{ position:"relative", background:bg, minHeight:500, overflow:"hidden",
          boxShadow:"0 24px 64px rgba(0,0,0,0.22), 0 6px 20px rgba(0,0,0,0.10)" }}
      >
        {/* Bold accent header bar */}
        <div style={{ height:8, width:"100%", background:accent }} />

        <div style={{ position:"relative", display:"flex", flexDirection:"column", minHeight:490, padding:"1.75rem" }}>
          {/* Occasion badge */}
          <span style={{ alignSelf:"flex-start", display:"inline-block", padding:"4px 10px", borderRadius:"2px",
            fontSize:"9px", fontWeight:900, letterSpacing:"0.18em", textTransform:"uppercase",
            background:accent, color:badgeText, marginBottom:"0.875rem" }}>
            {occasion.emoji} {occasion.label}
          </span>

          {/* Big recipient name */}
          <h2 style={{ fontSize:"3rem", fontWeight:900, textTransform:"uppercase", letterSpacing:"-0.025em", lineHeight:0.92,
            color:text, fontFamily:template.fontFamily, margin:"0 0 1.5rem" }}>
            {name}
          </h2>

          <MediaBlock media={media} />

          {/* Message with quote marks */}
          <div style={{ flex:1, display:"flex", alignItems:"center" }}>
            <p style={{ fontSize:"1rem", lineHeight:1.7, color:text, fontFamily:template.messageFontFamily, margin:0 }}>
              &ldquo;{msg}&rdquo;
            </p>
          </div>

          {/* Signature row */}
          <div style={{ marginTop:"1.5rem", paddingTop:"1.25rem", borderTop:`1.5px solid ${accent}30`, display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
            <div>
              <p style={{ fontSize:"9px", fontWeight:900, textTransform:"uppercase", letterSpacing:"0.3em", color:accent, margin:"0 0 4px" }}>From</p>
              <p style={{ fontSize:"1.5rem", fontWeight:900, textTransform:"uppercase", color:text, fontFamily:template.fontFamily, margin:0 }}>{sender}</p>
            </div>
            <span style={{ fontSize:"2.5rem", color:accent, lineHeight:1 }}>♥</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CardSharePage() {
  const { id } = useParams()
  const [status, setStatus] = useState('loading')
  const [payload, setPayload] = useState(null)

  useEffect(() => {
    async function fetchCard() {
      const result = await getCardData(id)
      setStatus(result.status)
      setPayload(result.payload)
    }
    fetchCard()
  }, [id])

  if (status === 'loading') {
    return (
      <main className={styles.page}>
        <div className={styles.stateCard}>
          <div className={styles.loader} />
          <p>Loading your card...</p>
        </div>
      </main>
    )
  }

  if (status === 'missing') {
    return (
      <main className={styles.page}>
        <div className={styles.stateCard}>
          <h1>This card link is invalid</h1>
          <p>The card could not be found. Please ask the sender for a fresh link.</p>
          <div className={styles.actions}>
            <Link to="/" className={styles.btnPrimary}>Go home</Link>
            <Link to="/create" className={styles.btnGhost}>Create your own card</Link>
          </div>
        </div>
      </main>
    )
  }

  if (status === 'expired') {
    return (
      <main className={styles.page}>
        <div className={styles.stateCard}>
          <h1>This card has expired</h1>
          <p>Card links stay active for 30 days and then automatically expire.</p>
          <div className={styles.actions}>
            <Link to="/create" className={styles.btnPrimary}>Create another</Link>
            <Link to="/" className={styles.btnGhost}>Go home</Link>
          </div>
        </div>
      </main>
    )
  }

  const template = cardTemplates.find((t) => t.id === payload.templateId) || cardTemplates[0]
  const occasion = cardOccasions.find((o) => o.value === payload.occasionValue) || cardOccasions[0]

  return (
    <main className={styles.page} style={payload.screenBgColor ? { background: payload.screenBgColor } : undefined}>
      <div className={styles.wrapper}>
        <p className={styles.meta} style={payload.screenBgColor && (payload.screenBgColor.startsWith('#0') || payload.screenBgColor.startsWith('#1') || payload.screenBgColor.startsWith('#4c')) ? { color: 'rgba(255,255,255,0.6)' } : undefined}>
          Shared with love
        </p>

        <CardRender
          template={template}
          recipientName={payload.recipientName}
          senderName={payload.senderName}
          message={payload.message}
          occasion={occasion}
          media={payload.media}
          customColor={payload.customColor}
        />
      </div>
    </main>
  )
}
