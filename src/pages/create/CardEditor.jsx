import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImageIcon, Video, Camera, Mic, ChevronDown, ChevronUp,
  Send, Copy, Check, X, ArrowLeft, Users, Sparkles,
  Eye, Heart, Square, Palette, Loader2,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { cardTemplates, cardOccasions, colorPresets } from "./card-templates";
import {
  buildShareLink,
  generateCardId,
  makeSharePayload,
  saveSharedCard,
  uploadMedia,
  blobUrlToFile,
} from "../../utils/cardShare";
import styles from "./CardEditor.module.css";

/* ─── SHARED MEDIA BLOCK ─── */

function MediaBlock({ media, style }) {
  if (!media || media.length === 0) return null;
  const radius = style === "polaroid" ? "2px" : "10px";
  return (
    <div style={{ marginBottom:"1.25rem", display:"flex", flexDirection:"column", gap:"0.625rem" }}>
      {media.map((item, i) => (
        <div key={`${item.type}-${i}`} style={{ display:"flex", justifyContent:"center" }}>
          {item.type === "image" && (
            <img src={item.url} alt="Uploaded" style={{ maxHeight:160, objectFit:"cover", borderRadius:radius, boxShadow:"0 4px 16px rgba(0,0,0,0.10)" }} />
          )}
          {item.type === "video" && (
            <video src={item.url} controls style={{ maxHeight:160, borderRadius:radius, boxShadow:"0 4px 16px rgba(0,0,0,0.10)" }} />
          )}
          {item.type === "audio" && (
            <audio src={item.url} controls style={{ width:"100%" }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── LIVE CARD PREVIEW COMPONENT ─── */

function CardPreview({ template, recipientName, senderName, message, occasion, media, customColor }) {
  const bg     = customColor ? customColor.bg     : template.bgColor;
  const text   = customColor ? customColor.text   : template.textColor;
  const accent = customColor ? customColor.accent : template.accentColor;
  const badgeBg   = customColor ? customColor.accent      : template.badgeColor;
  const badgeText = customColor ? "#ffffff"                : template.badgeTextColor;
  const name   = recipientName || "Recipient";
  const sender = senderName    || "Sender";
  const msg    = message       || "Your message will appear here...";
  const msgOpacity = message ? 1 : 0.35;

  /* shared wrapper style — no Tailwind, no class dependencies */
  const wrap = {
    position: "relative",
    width: "100%",
    maxWidth: "430px",
    perspective: "1200px",
    fontFamily: "inherit",
  };

  /* ═══════════════════════════════
     CLASSIC  — warm parchment elegance
  ═══════════════════════════════ */
  if (template.style === "classic") {
    return (
      <motion.div layout style={wrap}>
        {/* Soft ambient glow behind the card */}
        <div style={{ position:"absolute", inset:"1rem", borderRadius:"1.5rem", opacity:0.14, filter:"blur(48px)", background:accent, pointerEvents:"none" }} />

        <motion.div
          initial={{ rotateY: -4, rotateX: 2, scale: 0.97 }}
          animate={{ rotateY: 0,  rotateX: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
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
              <p style={{ textAlign:"center", fontSize:"1rem", lineHeight:1.85, fontStyle:"italic", color:text, fontFamily:template.messageFontFamily, opacity:msgOpacity, margin:0 }}>
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
        </motion.div>
      </motion.div>
    );
  }

  /* ═══════════════════════════════
     MINIMAL  — editorial precision
  ═══════════════════════════════ */
  if (template.style === "minimal") {
    return (
      <motion.div layout style={wrap}>
        <motion.div
          initial={{ rotateY: -3, opacity: 0.8 }}
          animate={{ rotateY: 0,  opacity: 1 }}
          transition={{ duration: 0.5 }}
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
              <p style={{ fontSize:"0.9375rem", lineHeight:1.9, color:text, fontFamily:template.messageFontFamily, opacity:msgOpacity, margin:0 }}>
                {msg}
              </p>
            </div>

            <div style={{ marginTop:"2rem", paddingTop:"1.25rem", borderTop:`1px solid ${accent}18`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:"9px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.22em", color:accent }}>With love</span>
              <span style={{ fontSize:"1.125rem", fontWeight:500, color:text, fontFamily:template.fontFamily }}>{sender}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  /* ═══════════════════════════════
     POLAROID  — photo-first memory
  ═══════════════════════════════ */
  if (template.style === "polaroid") {
    const imgItem = media.find((m) => m.type === "image");
    return (
      <motion.div layout style={wrap}>
        <motion.div
          initial={{ rotate: -1.5, scale: 0.97 }}
          animate={{ rotate: 0.8,  scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 80, damping: 14 }}
          style={{ position:"relative", background:bg, borderRadius:"2px", minHeight:530, overflow:"hidden",
            boxShadow:"0 24px 60px rgba(0,0,0,0.16), 0 6px 16px rgba(0,0,0,0.08)" }}
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

            <p style={{ fontSize:"0.875rem", lineHeight:1.75, color:text, fontFamily:template.messageFontFamily, opacity:msgOpacity, margin:"0 0 1rem", flex:1 }}>
              {msg}
            </p>

            <p style={{ textAlign:"right", fontSize:"1.0625rem", color:accent,
              fontFamily:"'Dancing Script','Segoe Script','Brush Script MT',cursive", lineHeight:1.2, margin:0 }}>
              — {sender}
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  /* ═══════════════════════════════
     HANDWRITTEN  — notebook warmth
  ═══════════════════════════════ */
  if (template.style === "handwritten") {
    return (
      <motion.div layout style={wrap}>
        <motion.div
          initial={{ rotate: 0.8 }}
          animate={{ rotate: -0.5 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 90 }}
          style={{ position:"relative", background:bg, minHeight:490, overflow:"hidden",
            boxShadow:"0 12px 44px rgba(0,0,0,0.10), 0 3px 10px rgba(0,0,0,0.06)" }}
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
              <p style={{ fontSize:"1rem", lineHeight:2.1, fontStyle:"italic", color:text, fontFamily:template.messageFontFamily, opacity:msgOpacity, margin:0 }}>
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
        </motion.div>
      </motion.div>
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
      <motion.div layout style={wrap}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0.7 }}
          animate={{ scale: 1,    opacity: 1 }}
          transition={{ duration: 0.5 }}
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
                fontFamily:template.messageFontFamily, opacity:msgOpacity, margin:0,
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
        </motion.div>
      </motion.div>
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
      <motion.div layout style={wrap}>
        <motion.div
          initial={{ rotate: -0.5, scale: 0.97 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.6, type:"spring", stiffness:90 }}
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
            <p style={{ fontSize:"0.875rem", lineHeight:2.0, color:textFinal, fontFamily:template.messageFontFamily, opacity:msgOpacity, margin:"0 0 1.25rem", flex:1 }}>
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
        </motion.div>
      </motion.div>
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
      <motion.div layout style={wrap}>
        <motion.div
          initial={{ scale: 0.96, opacity: 0.7 }}
          animate={{ scale: 1,    opacity: 1 }}
          transition={{ duration: 0.55, ease:[0.22,1,0.36,1] }}
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
                fontFamily:template.messageFontFamily, opacity:msgOpacity, margin:0,
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
        </motion.div>
      </motion.div>
    );
  }

  /* ═══════════════════════════════
     BOLD  — typographic statement
  ═══════════════════════════════ */
  return (
    <motion.div layout style={wrap}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0.8 }}
        animate={{ scale: 1,    opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
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
            <p style={{ fontSize:"1rem", lineHeight:1.7, color:text, fontFamily:template.messageFontFamily, opacity:msgOpacity, margin:0 }}>
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
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN CARD EDITOR PAGE
═══════════════════════════════════════════ */

export default function CardEditor() {
  const [searchParams] = useSearchParams();
  const occasionParam = searchParams.get('occasion');
  const initialOccasion = occasionParam
    ? cardOccasions.find((o) => o.value === occasionParam) || cardOccasions[5]
    : cardOccasions[5];

  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [occasion, setOccasion] = useState(initialOccasion);
  const [selectedTemplate, setSelectedTemplate] = useState(cardTemplates[0]);
  const [customColor, setCustomColor] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [sendToMultiple, setSendToMultiple] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showVoiceOptions, setShowVoiceOptions] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const handleFileUpload = useCallback((e, type) => {
    const input = e.target;
    const file = input.files?.[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedMedia((prev) => [...prev, { type, name: file.name, url, file }]);
    }

    // Reset input value so selecting the same file again still triggers onChange.
    input.value = "";
  }, []);

  const handleSend = async () => {
    setIsUploading(true);
    try {
      const id = generateCardId();

      // Upload all media files to Supabase storage
      const uploadedUrls = [];
      for (const item of uploadedMedia) {
        let publicUrl = null;

        if (item.file instanceof File) {
          publicUrl = await uploadMedia(item.file, id);
        } else if (item.url?.startsWith('blob:')) {
          // Fallback for older in-memory media items without a stored File object.
          const file = await blobUrlToFile(item.url, item.name || `media.${item.type === 'image' ? 'jpg' : item.type === 'video' ? 'webm' : 'webm'}`);
          if (file) {
            publicUrl = await uploadMedia(file, id);
          }
        } else if (item.url) {
          // Already a public URL
          publicUrl = item.url;
        }

        if (publicUrl) {
          uploadedUrls.push({ type: item.type, url: publicUrl, name: item.name });
        }
      }

      const payload = makeSharePayload({
        cardId: id,
        recipientName,
        senderName,
        message,
        occasionValue: occasion.value,
        templateId: selectedTemplate.id,
        customColor,
        media: uploadedUrls,
      });

      const success = await saveSharedCard(id, payload);
      if (!success) {
        console.error('Failed to save card to database');
      }

      const link = buildShareLink(id);
      setShareLink(link);
      setShowShareModal(true);
    } catch (err) {
      console.error('Error creating card:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const startRecordingTimer = () => {
    setRecordingTime(0);
    timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
  };

  const stopRecordingTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setUploadedMedia((prev) => [...prev, { type: "audio", name: "voice-recording.webm", url }]);
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setRecordingTime(0);
      };
      recorder.start();
      setIsRecordingVoice(true);
      setShowVoiceOptions(false);
      startRecordingTimer();
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const stopVoiceRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecordingVoice(false);
    stopRecordingTimer();
  };

  const videoPreviewRef = useCallback(
    (node) => {
      if (node && streamRef.current) {
        node.srcObject = streamRef.current;
        node.play().catch(() => {});
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showCameraModal]
  );

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setUploadedMedia((prev) => [...prev, { type: "video", name: "video-recording.webm", url }]);
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setRecordingTime(0);
        setShowCameraModal(false);
      };
      recorder.start();
      setIsRecordingVideo(true);
      setShowCameraModal(true);
      startRecordingTimer();
    } catch (err) {
      console.error("Camera access denied:", err);
      setShowCameraModal(false);
    }
  };

  const stopVideoRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecordingVideo(false);
    stopRecordingTimer();
  };

  const cancelVideoRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsRecordingVideo(false);
    setShowCameraModal(false);
    setRecordingTime(0);
    stopRecordingTimer();
  };

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      stopRecordingTimer();
    };
  }, []);

  return (
    <div className={styles.editorPage}>
      {/* Occasion selector bar */}
      <div className={styles.occasionBar}>
        <div className={styles.occasionInner}>
          <div className={styles.occasionScroll}>
            {cardOccasions.map((occ) => (
              <button
                key={occ.value}
                onClick={() => setOccasion(occ)}
                className={`${styles.occasionBtn} ${occasion.value === occ.value ? styles.active : ''}`}
              >
                <span>{occ.emoji}</span>
                <span>{occ.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.editorLayout}>
        {/* ───────── LEFT PANEL: FORM ───────── */}
        <div className={styles.formPanel}>
          <div className={styles.formScroll}>
            {/* Back link */}
            <Link to="/" className={styles.backLink}>
              <ArrowLeft /> Back to home
            </Link>

            {/* Template selector */}
            <div className={styles.formGroupLg}>
              <label className={styles.sectionLabel}>Choose a style</label>
              <div className={styles.templateScroll}>
                {cardTemplates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => { setSelectedTemplate(tmpl); setCustomColor(null); }}
                    className={`${styles.templateCard} ${selectedTemplate.id === tmpl.id && !customColor ? styles.active : ''}`}
                  >
                    <div
                      className={styles.templateInner}
                      style={{
                        background: tmpl.bgColor,
                        color: tmpl.textColor,
                        borderRadius: tmpl.style === "minimal" || tmpl.style === "bold" ? "4px" : "12px",
                      }}
                    >
                      <div>
                        <div className={styles.templateName} style={{ color: tmpl.accentColor }}>{tmpl.name}</div>
                        <div className={styles.templateDesc}>{tmpl.description}</div>
                      </div>
                    </div>
                    {selectedTemplate.id === tmpl.id && !customColor && (
                      <motion.div layoutId="template-check" className={styles.templateCheck}>
                        <Check />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Color customization */}
            <div className={styles.formGroupLg}>
              <button onClick={() => setShowColorPicker(!showColorPicker)} className={styles.collapseBtn}>
                <span className={styles.collapseBtnLeft}>
                  <Palette />
                  <span>Customize colors</span>
                </span>
                <span className={styles.collapseBtnRight}>
                  {customColor && (
                    <>
                      <span className={styles.colorDot} style={{ backgroundColor: customColor.bg }} />
                      <span className={styles.colorDot} style={{ backgroundColor: customColor.accent }} />
                    </>
                  )}
                  <ChevronDown className={showColorPicker ? styles.rotated : ''} style={{ transform: showColorPicker ? 'rotate(180deg)' : 'none' }} />
                </span>
              </button>
              <AnimatePresence>
                {showColorPicker && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
                    <div className={styles.colorPanel}>
                      <p className={styles.colorPanelLabel}>Preset palettes</p>
                      <div className={styles.presetGrid}>
                        {colorPresets.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => setCustomColor({ bg: preset.bg, text: preset.text, accent: preset.accent })}
                            className={`${styles.presetBtn} ${customColor?.accent === preset.accent ? styles.active : ''}`}
                          >
                            <div className={styles.presetDots}>
                              <span style={{ backgroundColor: preset.bg, border: '1px solid rgba(0,0,0,0.05)' }} />
                              <span style={{ backgroundColor: preset.accent }} />
                            </div>
                            <p className={styles.presetName}>{preset.name}</p>
                          </button>
                        ))}
                      </div>
                      <p className={styles.colorPanelLabel}>Custom color</p>
                      <div className={styles.colorRow}>
                        <div className={styles.colorInputWrap}>
                          <span className={styles.colorInputLabel}>Background</span>
                          <div className={styles.colorInputBox}>
                            <input type="color" value={customColor?.bg || "#ffffff"} onChange={(e) => setCustomColor((prev) => ({ bg: e.target.value, text: prev?.text || "#2c2c2c", accent: prev?.accent || "#e11d48" }))} />
                            <span>{customColor?.bg || "#ffffff"}</span>
                          </div>
                        </div>
                        <div className={styles.colorInputWrap}>
                          <span className={styles.colorInputLabel}>Accent</span>
                          <div className={styles.colorInputBox}>
                            <input type="color" value={customColor?.accent || "#e11d48"} onChange={(e) => setCustomColor((prev) => ({ bg: prev?.bg || "#ffffff", text: prev?.text || "#2c2c2c", accent: e.target.value }))} />
                            <span>{customColor?.accent || "#e11d48"}</span>
                          </div>
                        </div>
                      </div>
                      {customColor && (
                        <button onClick={() => setCustomColor(null)} className={styles.resetBtn}>
                          Reset to template default
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Recipient */}
            <div className={styles.formGroup}>
              <label className={styles.sectionLabel}>Who will receive this gift?</label>
              <div className={styles.toggleRow}>
                <span className={styles.toggleRowLabel}>
                  <Users />
                  <span>Send to multiple people</span>
                </span>
                <button
                  onClick={() => setSendToMultiple(!sendToMultiple)}
                  className={`${styles.toggleSwitch} ${sendToMultiple ? styles.on : styles.off}`}
                >
                  <motion.div
                    style={{ position: 'absolute', top: 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
                    animate={{ left: sendToMultiple ? 22 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
              <input
                type="text"
                placeholder="Their name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className={styles.textInput}
              />
            </div>

            {/* Message */}
            <div className={styles.formGroup}>
              <label className={styles.sectionLabel}>Write from the heart</label>
              <textarea
                placeholder="What would you like to say?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className={styles.textInput}
              />
            </div>

            {/* Media upload */}
            <div className={styles.formGroup}>
              <label className={styles.sectionLabel}>Choose a moment to spotlight</label>
              <div className={styles.mediaBtns}>
                {[
                  { icon: ImageIcon, label: "Photo", onClick: () => fileInputRef.current?.click() },
                  { icon: Video, label: "Video", onClick: () => videoInputRef.current?.click() },
                  { icon: Camera, label: "Record", onClick: startVideoRecording },
                ].map(({ icon: Icon, label, onClick }) => (
                  <button key={label} onClick={onClick} className={styles.mediaBtn}>
                    <Icon />
                    <span>{label}</span>
                  </button>
                ))}

                {/* Voice button with dropdown */}
                <div className={styles.voiceDropWrap}>
                  <button onClick={() => setShowVoiceOptions(!showVoiceOptions)} className={styles.mediaBtn}>
                    <Mic />
                    <span>Voice</span>
                    <ChevronDown style={{ width: 12, height: 12, transform: showVoiceOptions ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  <AnimatePresence>
                    {showVoiceOptions && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={styles.voiceDrop}
                      >
                        <button onClick={() => { audioInputRef.current?.click(); setShowVoiceOptions(false); }} className={styles.voiceDropBtn}>
                          <Mic />
                          Upload Voice
                        </button>
                        <div className={styles.voiceDropDiv} />
                        <button onClick={startVoiceRecording} className={styles.voiceDropBtn}>
                          <Mic style={{ color: '#ef4444' }} />
                          Record Voice
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Hidden file inputs */}
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, "image")} />
              <input ref={videoInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, "video")} />
              <input ref={audioInputRef} type="file" accept="audio/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, "audio")} />

              {/* Voice recording indicator */}
              <AnimatePresence>
                {isRecordingVoice && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={styles.recordingBar}>
                    <div className={styles.recordingLeft}>
                      <span className={styles.recordingDot} />
                      <span className={styles.recordingText}>Recording... {formatTime(recordingTime)}</span>
                    </div>
                    <button onClick={stopVoiceRecording} className={styles.stopBtn}>
                      <Square style={{ fill: '#fff' }} />
                      Stop
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Uploaded media preview */}
              {uploadedMedia.length > 0 && (
                <div className={styles.uploadedList}>
                  {uploadedMedia.map((item, index) => (
                    <motion.div key={`${item.type}-${index}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={styles.uploadedChip}>
                      <div className={styles.uploadedChipLeft}>
                        <Check />
                        <span>{item.name}</span>
                      </div>
                      <button onClick={() => setUploadedMedia((prev) => prev.filter((_, i) => i !== index))} className={styles.uploadedChipX}>
                        <X />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Sender */}
            <div className={styles.formGroup}>
              <label className={styles.sectionLabel}>Sign your gift</label>
              <input
                type="text"
                placeholder="Your name"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className={styles.textInput}
              />
            </div>

            {/* More options */}
            <div className={styles.formGroup}>
              <button onClick={() => setShowMoreOptions(!showMoreOptions)} className={styles.moreOptionsBtn}>
                {showMoreOptions ? <ChevronUp /> : <ChevronDown />}
                More options
              </button>
              <AnimatePresence>
                {showMoreOptions && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
                    <div className={styles.moreOptionsPanel}>
                      <div className={styles.optionCard}>
                        <p className={styles.optionCardLabel}>Schedule delivery</p>
                        <input type="datetime-local" className={styles.optionCardInput} />
                      </div>
                      <div className={styles.optionCard}>
                        <p className={styles.optionCardLabel}>Add a calendar event</p>
                        <input type="text" placeholder="Event name (optional)" className={styles.optionCardInput} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile inline preview */}
            <div className={styles.mobileInlinePreview}>
              <div className={styles.mobileInlinePreviewLabel}>Live Preview</div>
              <CardPreview
                template={selectedTemplate}
                recipientName={recipientName}
                senderName={senderName}
                message={message}
                occasion={occasion}
                media={uploadedMedia}
                customColor={customColor}
              />
              <div className={styles.mobileInlinePreviewCaption}>
                {selectedTemplate.name} · {selectedTemplate.description}
              </div>
            </div>

            {/* Mobile preview toggle */}
            <button onClick={() => setShowMobilePreview(true)} className={styles.mobilePreviewBtn}>
              <Eye />
              Preview card
            </button>

            {/* Send button */}
            <button onClick={handleSend} disabled={isUploading} className={styles.sendBtn}>
              {isUploading ? (
                <>
                  <Loader2 style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Creating card...</span>
                </>
              ) : (
                <>
                  <Heart style={{ fill: 'rgba(255,255,255,0.3)' }} />
                  <span>Send with love</span>
                  <motion.span style={{ marginLeft: 4 }} animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ───────── RIGHT PANEL: LIVE PREVIEW ───────── */}
        <div className={styles.previewPanel}>
          <div className={styles.previewTopBar}>
            <div className={styles.previewLabel}>✦ Live Preview</div>
            <button className={styles.previewEntranceBtn}>
              <Eye />
              Preview entrance
            </button>
          </div>
          <CardPreview
            template={selectedTemplate}
            recipientName={recipientName}
            senderName={senderName}
            message={message}
            occasion={occasion}
            media={uploadedMedia}
            customColor={customColor}
          />
          <div className={styles.previewCaption}>{selectedTemplate.name} · {selectedTemplate.description}</div>
        </div>
      </div>

      {/* ───────── MOBILE PREVIEW OVERLAY ───────── */}
      <AnimatePresence>
        {showMobilePreview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.overlay}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={styles.overlayCard}>
              <button onClick={() => setShowMobilePreview(false)} className={styles.overlayClose}>
                <X />
              </button>
              <CardPreview
                template={selectedTemplate}
                recipientName={recipientName}
                senderName={senderName}
                message={message}
                occasion={occasion}
                media={uploadedMedia}
                customColor={customColor}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───────── CAMERA RECORDING MODAL ───────── */}
      <AnimatePresence>
        {showCameraModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.overlay}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={styles.cameraModal}>
              <div className={styles.cameraVideo}>
                <video ref={videoPreviewRef} autoPlay muted playsInline />
                {isRecordingVideo && (
                  <div className={styles.cameraTimer}>
                    <span className={styles.recordingDot} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>{formatTime(recordingTime)}</span>
                  </div>
                )}
              </div>
              <div className={styles.cameraControls}>
                <button onClick={cancelVideoRecording} className={styles.cameraCancelBtn}>
                  <X />
                  Cancel
                </button>
                {isRecordingVideo && (
                  <button onClick={stopVideoRecording} className={styles.cameraStopBtn}>
                    <Square style={{ fill: '#fff' }} />
                    Stop & Save
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───────── SHARE MODAL ───────── */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.overlay}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className={styles.shareModal}>
              <button onClick={() => setShowShareModal(false)} className={styles.shareModalClose}>
                <X />
              </button>
              <div className={styles.shareModalCenter}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className={styles.shareIconCircle}>
                  <Sparkles />
                </motion.div>
                <h3 className={styles.shareTitle}>Your card is ready! 🎉</h3>
                <p className={styles.shareSubtitle}>Share this link with your special someone. It will expire in 30 days.</p>
              </div>
              <div className={styles.shareLinkRow}>
                <input type="text" readOnly value={shareLink} />
                <button onClick={handleCopyLink} className={styles.copyBtn}>
                  {copied ? (<><Check />Copied!</>) : (<><Copy />Copy</>)}
                </button>
              </div>
              <div className={styles.shareActions}>
                <button onClick={() => setShowShareModal(false)} className={styles.shareSecondaryBtn}>
                  Create another
                </button>
                <Link to="/" className={styles.shareHomeLink}>
                  Go home
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
