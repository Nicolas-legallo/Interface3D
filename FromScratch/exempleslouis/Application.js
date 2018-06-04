var infologic;
(function (infologic) {
    (function (demo) {
        "use strict";

        var Application = (function () {
            function Application() {
                this.parametrage = false;
                this.flag = true;
                this.idNumber = 2000;
                this.nouveauxModules = [];
                this.etatColonne = false;
                this.hauteurMaxColonne = 0;
            }
            Application.prototype.start = function () {
                var _this = this;
                this.modules = [];

                document.body.style.overflow = "";

                $("#references").mouseover(function () {
                    $("#cadreTxtRefCorpo").html("Références client");
                });

                $("#references").mouseout(function () {
                    $("#cadreTxtRefCorpo").html("");
                });

                $("#presentation").mouseover(function () {
                    $("#cadreTxtRefCorpo").html("Présentation commerciale");
                });

                $("#presentation").mouseout(function () {
                    $("#cadreTxtRefCorpo").html("");
                });

                $("#referencesRegion").mouseover(function () {
                    $("#cadreTxtRefCorpo").html("Références client par région");
                });

                $("#referencesRegion").mouseout(function () {
                    $("#cadreTxtRefCorpo").html("");
                });

                var textAreaExporterBDD = $("<input class='textAreaExporter' type='text' name='nomFichier' value='nom de la nouvelle base'>");
                var exporterBDD = $("<span class='exporterBDD'>Sauvegarder les modifications</span>");

                $("#cadreExporterBDD").remove();
                var cadreExporterBDD = $("<div id='cadreExporterBDD'>");
                cadreExporterBDD.append(textAreaExporterBDD, exporterBDD);
                $("#BDDSelect").before(cadreExporterBDD);

                exporterBDD.click(function () {
                    _this.exporterBDD(textAreaExporterBDD.val(), _this.nouveauxModules);
                });

                if (localStorage.getItem("BDD")) {
                    var cadreRecupStorage = $("<div id='cadreRecupStorage'>");
                    var recupStorageTxt = $("<div id='recupStorageTxt'>Récupérer la dernière version modifiée de la BDD sur ce navigateur (notamment si vous avez perdu votre paramétrage sans avoir eu le temps de l'enregistrer, etc...) :</div>");
                    var recupStorageBtn = $("<div id='recupStorageBtn'>Récupérer la BDD</div>");

                    cadreRecupStorage.append(recupStorageTxt, recupStorageBtn);
                    $("#BDDSelect").after(cadreRecupStorage);

                    recupStorageBtn.click(function () {
                        _this.BDD = localStorage.getItem("BDD");
                        _this.BDDParse = JSON.parse(_this.BDD);

                        _this.nouveauxModules = [];

                        _this.constructionBDD();
                    });
                }

                window.onload = function () {
                    var fileInput = document.getElementById("fileInput");

                    fileInput.addEventListener("change", function (e) {
                        var file = fileInput.files[0];
                        var textType = /text.*/;

                        if (file.type.match(textType)) {
                            var reader = new FileReader();

                            reader.onload = function (e) {
                                _this.baseRecuperee = reader.result;

                                _this.nouveauxModules = [];

                                _this.BDD = _this.baseRecuperee;

                                _this.BDDParse = JSON.parse(_this.BDD);

                                _this.constructionBDD();
                            };

                            reader.readAsText(file);
                        } else {
                        }
                    });
                };

                $("#demo").click(function () {
                    _this.afficheMenu(false, "#DBDBDB", "white");
                });

                $("#parametrage").click(function () {
                    _this.afficheMenu(true, "white", "#DBDBDB");
                });
            };

            Application.prototype.constructionBDD = function () {
                var _this = this;
                this.BDDParse.forEach(function (mod) {
                    var nouveauModule = new demo.Module(mod.nom, mod.nomImage);
                    nouveauModule.setAfficher(mod.afficher);

                    mod.sousModules.forEach(function (ssmod) {
                        var nouveauSousModule = new demo.SousModule(ssmod.nom);
                        nouveauSousModule.setAfficher(ssmod.afficher);

                        ssmod.fonctionnalites.forEach(function (fonc) {
                            var nouvelleFonctionnalite = new demo.Fonctionnalite(fonc.nom, fonc.id, fonc.diapo, fonc.url, fonc.temoignage, fonc.pdf, fonc.typeBtn, fonc.heritage);
                            nouvelleFonctionnalite.setAfficher(fonc.afficher);
                            nouveauSousModule.addFonctionnalite(nouvelleFonctionnalite);
                        });
                        nouveauModule.addSousModule(nouveauSousModule);
                    });
                    _this.nouveauxModules.push(nouveauModule);
                });

                this.modules = this.nouveauxModules;

                this.afficheMenu(false, "#DBDBDB", "white");
            };

            Application.prototype.afficheMenu = function (trueOrFalse, couleurDemo, couleurParam) {
                var _this = this;
                this.remonterImg();

                this.parametrage = trueOrFalse;

                $("#menu").empty();
                $(".module").remove();

                $("#contentFonc").remove();

                if ($("#videoHTML").length) {
                    $("#videoHTML").remove();
                }

                this.modules.forEach(function (mod) {
                    var elt = $("<div class='col-sm-1'>");

                    $("#menu").append(elt);

                    $("#demo").css("background-color", couleurDemo);
                    $("#parametrage").css("background-color", couleurParam);

                    var fondPicto = $("<center class='col-sm-12 menuPicto'>");
                    var picto = $(" <img class='picto'>");
                    picto.attr("src", "img/" + mod.getNomImage() + ".png");
                    fondPicto.append(picto);
                    elt.append(fondPicto);

                    var modTxt = $("<center class='col-sm-12 menuVert'>");
                    modTxt.text(mod.getNom());

                    elt.append(modTxt);

                    modTxt.append("<img id='fleche" + mod.getNomImage() + "' class='fleche' src='img/fleche.png'>");

                    elt.click(function () {
                        _this.afficherModule(mod);
                        modTxt.css("color", "#475242");
                        $(".fleche").css("opacity", "0");
                        $("#fleche" + mod.getNomImage() + "").css("opacity", "1");
                        $("#imgFond").attr("src", "img/img_module/" + mod.getNomImage() + ".jpg");
                    });
                });
            };

            Application.prototype.afficherModule = function (mod) {
                var _this = this;
                this.remonterImg();

                this.hauteurMaxColonne = 0;

                this.etatColonne = false;

                $(".menuVert").css("color", "white");

                $(".module").remove();
                $("#contentFonc").remove();

                var modElt = $("<table>");
                modElt.addClass("module");
                $("#CadreAppli").append(modElt);

                mod.getSousModules().forEach(function (sousMod) {
                    _this.afficherSousModule(modElt, sousMod, mod);
                });

                if (this.parametrage) {
                    var formSousMod = $("<div class='sous-module'>");
                    var textAreaSousMod = $("<input class='textArea' type='text' name='nouveauSousMod' value='Ajoutez un sous-module'>");
                    var submitSousMod = $("<br><span class='ok'>ok</span>");

                    modElt.append(formSousMod);
                    formSousMod.append(textAreaSousMod);
                    formSousMod.append(submitSousMod);

                    submitSousMod.click(function () {
                        mod.addSousModule(new demo.SousModule(textAreaSousMod.val()));
                        _this.afficherModule(mod);

                        _this.enregistrerLocalStorage();
                    });
                }
            };

            Application.prototype.afficherSousModule = function (modElt, sousMod, mod) {
                var _this = this;
                var sousModElt = $("<div>");
                sousModElt.addClass("sous-module");

                if (!this.parametrage) {
                    if (sousMod.isAfficher()) {
                        modElt.append(sousModElt);
                    } else {
                    }
                } else {
                    modElt.append(sousModElt);
                }

                sousMod.getFonctionnalites().forEach(function (fonc) {
                    if (!_this.parametrage) {
                        if (!fonc.isAfficher()) {
                        } else {
                            _this.afficherFonctionnalite(sousModElt, fonc, sousMod, mod, modElt);
                        }
                    } else {
                        _this.afficherFonctionnalite(sousModElt, fonc, sousMod, mod, modElt);
                    }
                });

                if (sousModElt.offset().left < 25) {
                    this.hauteurMaxColonne = 0;
                }

                if (sousModElt.height() > this.hauteurMaxColonne) {
                    this.hauteurMaxColonne = sousModElt.height();
                }

                var hauteurColonneContent = sousModElt.height();

                sousModElt.css("margin-bottom", this.hauteurMaxColonne - hauteurColonneContent);

                if (this.parametrage) {
                    var formFonc = $("<form></form>");
                    var textAreaForm = $("<input class='textArea' type='text' name='nouvelleFonc' value='nom de la fonction//diapo.pdf//demo.mp4//fiche.pdf//video.mp4//couleur'>");
                    var submitFonc = $("<br><span class='ok'>ok</span>");
                    var afficherSousMod = $("<span class='afficherSousMod'>sous-module affiché</span>");

                    sousModElt.append(formFonc);
                    formFonc.append(textAreaForm);
                    formFonc.append(submitFonc);
                    sousModElt.append(afficherSousMod);

                    textAreaForm.focus(function () {
                        textAreaForm.animate({ width: "+=300", height: "+=5", zIndex: "+=10" }, "quick");
                    }).blur(function () {
                        textAreaForm.animate({ width: "-=300", height: "-=5", zIndex: "-=10" }, "quick");
                    });

                    submitFonc.click(function () {
                        var textAreaFormTab = textAreaForm.val().split("//");

                        var nomFonc;
                        var ID;
                        var diapo;
                        var video;
                        var temoignage;
                        var fiche;
                        var typeBtn;
                        var lienHeritage;

                        nomFonc = textAreaFormTab[0];
                        if (textAreaFormTab[5] === "vert" || textAreaFormTab[5] === "gris") {
                            _this.compterFoncTotal();

                            ID = "id_" + (_this.idNumber++, _this.idNumber).toString();
                        } else {
                            ID = "_";
                        }

                        diapo = textAreaFormTab[1];
                        video = textAreaFormTab[2];
                        fiche = textAreaFormTab[3];
                        temoignage = textAreaFormTab[4];
                        typeBtn = textAreaFormTab[5];

                        if (textAreaFormTab[5] === "blanc") {
                            lienHeritage = "id_" + (_this.idNumber).toString();
                        } else {
                            lienHeritage = "_";
                        }

                        sousMod.addFonctionnalite(new demo.Fonctionnalite(nomFonc, ID, diapo, video, temoignage, fiche, typeBtn, lienHeritage));

                        if (typeBtn === "gris") {
                            sousMod.setNom(nomFonc);
                        }

                        _this.afficherModule(mod);

                        _this.enregistrerLocalStorage();
                    });

                    afficherSousMod.click(function () {
                        if (sousMod.isAfficher()) {
                            sousMod.setAfficher(false);
                            afficherSousMod.css("background-color", "#F37721");
                            afficherSousMod.html("sous-module caché");
                        } else {
                            sousMod.setAfficher(true);
                            afficherSousMod.css("background-color", "#80A7A9");
                            afficherSousMod.html("sous-module affiché");
                        }

                        _this.enregistrerLocalStorage();
                    });

                    if (!sousMod.isAfficher()) {
                        afficherSousMod.html("caché");
                        afficherSousMod.css("background-color", "#F37721");
                    }
                }

                if ($(window).width() <= 870) {
                }

                if ($(window).width() > 870) {
                    this.colonneGauche(sousModElt, modElt, sousMod, mod);
                }

                $(window).resize(function () {
                    if ($(window).width() <= 870) {
                        sousModElt.unbind();
                    }

                    if ($(window).width() > 870) {
                        sousModElt.unbind();
                        _this.colonneGauche(sousModElt, modElt, sousMod, mod);
                    }
                });
            };

            Application.prototype.afficherFonctionnalite = function (sousModElt, fonc, sousMod, mod, modElt) {
                var _this = this;
                var foncElt = $("<li>");

                var foncVid = $("<img src='img/on.png' class = 'onOff'>");

                var foncTemoignage = $("<img src='img/temoignage.png' class = 'onOff'>");

                var nomFonc = fonc.getNom().replace(/'/g, "_").replace(/\//g, "_");

                var nomSousMod = sousMod.getNom().replace(/'/g, "_").replace(/\//g, "_");

                var foncPDF = $("<a href='docs/" + mod.getNom() + "/" + nomSousMod + "/" + nomFonc + "/" + fonc.getPdf() + "' target='_blank'><img src='img/fiche.png' class = 'onOff'></a>");

                foncPDF.click(function () {
                    if (!_this.etatColonne) {
                        sousModElt.unbind();

                        sousModElt.bind("click", function () {
                            sousModElt.unbind();
                            _this.colonneGauche(sousModElt, modElt, sousMod, mod);
                        });
                    }
                });

                var foncDiap = $("<img src='img/diap.png' class = 'onOff'>");

                var foncOnOff = $("<img src='img/on.png' class = 'onOff'>");
                var afficherFonc = $("<img src='img/afficher.png' class = 'afficherFonc'>");

                var foncPicto = $("<span class='foncPicto'>");

                var video = $("<video id='videoHTML' width='100%' controls>");

                var temoignage = $("<video id='videoHTML' width='100%' controls>");

                var foncEltTxt;

                var changerNom = $("<span class='okChangerNom'>OK</span>");

                if (this.parametrage) {
                    var nomFoncParam = fonc.getNom().replace(/'/g, "&apos;");

                    foncEltTxt = $("<input class='inputFonc' type='text' name='foncTxt' value='" + nomFoncParam + "//" + fonc.getDiapo() + "//" + fonc.getUrl() + "//" + fonc.getTemoignage() + "//" + fonc.getPdf() + "//" + fonc.getTypeBtn() + "'>");

                    changerNom.click(function () {
                    });

                    foncEltTxt.focus(function () {
                        foncEltTxt.animate({ width: "+=400", height: "+=5", zIndex: "+=10" }, "quick");
                    }).blur(function () {
                        foncEltTxt.animate({ width: "-=400", height: "-=5", zIndex: "-=10" }, "quick");

                        var textAreaFoncParam = foncEltTxt.val().split("//");

                        fonc.setNom(textAreaFoncParam[0]);
                        fonc.setDiapo(textAreaFoncParam[1]);
                        fonc.setUrl(textAreaFoncParam[2]);
                        fonc.setTemoignage(textAreaFoncParam[3]);
                        fonc.setPdf(textAreaFoncParam[4]);
                        fonc.setTypeBtn(textAreaFoncParam[5]);

                        _this.enregistrerLocalStorage();
                    });
                } else {
                    foncEltTxt = $("<span class='foncTxt'>");
                }

                foncElt.addClass("fonctionnalite");
                sousModElt.append(foncElt);

                foncEltTxt.html(fonc.getNom());
                foncElt.append(foncEltTxt);

                if (fonc.getTypeBtn() === "blanc") {
                    foncElt.addClass(fonc.getHeritage());

                    foncElt.css("background-color", "white");
                    foncElt.css("color", "#424242");
                    foncElt.css("border", "solid 1px #D2D2D2");
                    foncElt.addClass("increment");
                    foncElt.before("<img src='img/chevron.png' class='chevron'>");
                }

                if (fonc.getTypeBtn() === "gris") {
                    foncElt.addClass("titreSousMod");
                    foncElt.removeClass("fonctionnalite");
                }

                if (fonc.getTypeBtn() === "vert" || fonc.getTypeBtn() === "blanc") {
                    foncEltTxt.addClass("btnFonc");
                }

                if (fonc.getTypeBtn() === "gris") {
                    if (fonc.getNom().length > 33) {
                        foncElt.css("line-height", "8px");
                    }
                }

                if (foncEltTxt.height() <= 15) {
                    foncElt.css("line-height", "normal");
                }

                if (!this.parametrage) {
                    var nbPicto = 0;

                    if (fonc.isOnOff() === true && fonc.getUrl() !== "demo.mp4") {
                        foncPicto.append(foncVid);
                        nbPicto++;
                    }

                    if (fonc.getPdf() !== "fiche.pdf") {
                        foncPicto.append(foncPDF);
                        nbPicto++;
                    }

                    if (fonc.getDiapo() !== "diapo.pdf") {
                        foncPicto.append(foncDiap);
                        nbPicto++;
                    }

                    if (fonc.getTemoignage() !== "video.mp4") {
                        foncPicto.append(foncTemoignage);
                        nbPicto++;
                    }

                    if (nbPicto >= 3) {
                        foncPicto.css("width", "55px");
                    }

                    if (nbPicto >= 4) {
                        foncPicto.css("width", "75px");
                    }
                }

                foncElt.append(foncPicto);

                if (this.parametrage) {
                    foncPicto.append(afficherFonc);
                    foncElt.append(foncPicto);
                }

                foncOnOff.click(function () {
                    if (fonc.isOnOff()) {
                        fonc.setOnOff(false);
                        foncOnOff.attr("src", "img/off.png");
                    } else {
                        fonc.setOnOff(true);
                        foncOnOff.attr("src", "img/on.png");
                    }
                    ;
                });

                afficherFonc.click(function () {
                    if (fonc.isAfficher()) {
                        fonc.setAfficher(false);
                        afficherFonc.attr("src", "img/cacher.png");
                    } else {
                        fonc.setAfficher(true);
                        afficherFonc.attr("src", "img/afficher.png");
                    }
                    ;

                    _this.enregistrerLocalStorage();
                });

                if (!this.parametrage) {
                    foncElt.click(function () {
                        foncElt.css("background-color", "#aaaaaa");
                        foncElt.css("color", "white");
                        foncElt.css("border", "none");

                        fonc.setActif(false);

                        $("#contentFonc").remove();

                        var contentFonc = $("<div id='contentFonc' class='col-sm-9'></div>");
                        $("#CadreAppli").append(contentFonc);

                        if (fonc.getUrl() !== "demo.mp4" && fonc.isOnOff() === true) {
                            video.attr("src", "docs/" + mod.getNom() + "/" + nomSousMod + "/" + nomFonc + "/" + fonc.getUrl());
                            contentFonc.append(video);
                        }

                        if (fonc.getTemoignage() !== "video.mp4" && fonc.isOnOff() === true) {
                            temoignage.attr("src", "docs/" + mod.getNom() + "/" + nomSousMod + "/" + nomFonc + "/" + fonc.getTemoignage());
                            contentFonc.append(temoignage);
                        }

                        if (fonc.getDiapo() !== "diapo.pdf") {
                            contentFonc.append("<iframe src='docs/" + mod.getNom() + "/" + nomSousMod + "/" + nomFonc + "/" + fonc.getDiapo() + "' id='PDF' width='100%' height='100%' align='middle' frameborder='0' allowfullscreen='allowfullscreen'>");
                            contentFonc.append("<br><br><a href='docs/" + mod.getNom() + "/" + nomSousMod + "/" + nomFonc + "/" + fonc.getDiapo() + "' target='_blank' class='pdfGrandEcr'><img src='img/pdf.png'>Voir le PDF en plein écran</a>");
                        }
                    });
                }

                if (!fonc.isActif()) {
                    foncElt.css("background-color", "#aaaaaa");
                    foncElt.css("color", "white");
                    foncElt.css("border", "none");
                }

                this.actualiserProprietes(fonc, foncOnOff, afficherFonc);
            };

            Application.prototype.colonneGauche = function (sousModElt, modElt, sousMod, mod) {
                var _this = this;
                if (!this.parametrage) {
                    sousModElt.click(function () {
                        _this.etatColonne = true;

                        modElt.fadeOut(50);

                        var modElt2 = $("<table>");
                        modElt2.addClass("module col-sm-3");
                        $("#CadreAppli").append(modElt2);

                        var sousModElt = $("<div>");
                        sousModElt.addClass("sous-module");
                        modElt2.append(sousModElt);

                        var retour = $("<div id='retour'></div>");
                        var retourImg = $("<img src='img/retour.png'>");
                        var retourTxt = $("<span>Retour au module complet</span>");
                        retour.append(retourImg);
                        retour.append(retourTxt);
                        modElt2.append(retour);

                        retour.click(function () {
                            _this.afficherModule(mod);
                        });

                        sousMod.getFonctionnalites().forEach(function (fonc) {
                            if (!fonc.isAfficher()) {
                            } else {
                                _this.afficherFonctionnalite(sousModElt, fonc, sousMod, mod, modElt);
                            }
                        });

                        modElt2.css("margin", "0");
                    });
                }
            };

            Application.prototype.actualiserProprietes = function (fonc, foncOnOff, afficherFonc) {
                if (!fonc.isOnOff()) {
                    foncOnOff.attr("src", "img/off.png");
                }
                ;

                if (!fonc.isAfficher()) {
                    afficherFonc.attr("src", "img/cacher.png");
                }
            };

            Application.prototype.remonterImg = function () {
                if (this.flag) {
                    $("#imgFond").animate({ opacity: "0", display: "none" }, 500, function () {
                        $("#imgFond").css("display", "block").css("opacity", "1");
                    });
                }
                this.flag = false;
            };

            Application.prototype.compterFoncTotal = function () {
                var _this = this;
                this.idNumber = 2000;

                this.modules.forEach(function (mod) {
                    mod.getSousModules().forEach(function (sousMod) {
                        sousMod.getFonctionnalites().forEach(function (fonc) {
                            _this.idNumber++;
                        });
                    });
                });
            };

            Application.prototype.exporterBDD = function (nomFichier, nouveauxModules) {
                var nouvBDD = JSON.stringify(nouveauxModules, null, "\t");
                var exportBDD = new Blob([nouvBDD], { type: "text/plain;charset=utf-8" });

                saveAs(exportBDD, nomFichier + ".txt");
            };

            Application.prototype.enregistrerLocalStorage = function () {
                this.BDDStorageStr = JSON.stringify(this.modules);
                localStorage.setItem("BDD", this.BDDStorageStr);
            };
            return Application;
        })();
        demo.Application = Application;
    })(infologic.demo || (infologic.demo = {}));
    var demo = infologic.demo;
})(infologic || (infologic = {}));
//# sourceMappingURL=Application.js.map
