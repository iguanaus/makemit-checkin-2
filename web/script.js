// HackMIT Check-In System
// Label is 2 5/16 x 2
debug=false;

(function() {
  $.support.cors = true;
  var MAX_RESULTS = 100;

  function printLabel(name, fullname, group, organization, mentor) {
    if (debug) {
      return null
    }
    try {
      var labelXml = '<?xml version="1.0" encoding="utf-8"?>\
        <DieCutLabel Version="8.0" Units="twips">\
          <PaperOrientation>Landscape</PaperOrientation>\
          <Id>Address</Id>\
          <PaperName>30370 Zip Disk</PaperName>\
          <DrawCommands />\
          <ObjectInfo>\
            <TextObject>\
              <Name>name</Name>\
              <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
              <BackColor Alpha="0" Red="255" Green="255" Blue="255" />\
              <LinkedObjectName></LinkedObjectName>\
              <Rotation>Rotation0</Rotation>\
              <IsMirrored>False</IsMirrored>\
              <IsVariable>True</IsVariable>\
              <HorizontalAlignment>Center</HorizontalAlignment>\
              <VerticalAlignment>Middle</VerticalAlignment>\
              <TextFitMode>AlwaysFit</TextFitMode>\
              <UseFullFontHeight>True</UseFullFontHeight>\
              <Verticalized>False</Verticalized>\
              <StyledText>\
                <Element>\
                  <String>name</String>\
                  <Attributes>\
                    <Font Family="Montserrat" Size="18" Bold="False" Italic="False" Underline="False" Strikeout="False" />\
                    <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
                  </Attributes>\
                </Element>\
              </StyledText>\
            </TextObject>\
            <Bounds X="270" Y="192" Width="2790" Height="1152" />\
          </ObjectInfo>\
          <ObjectInfo>\
            <TextObject>\
              <Name>fullname</Name>\
              <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
              <BackColor Alpha="0" Red="255" Green="255" Blue="255" />\
              <LinkedObjectName></LinkedObjectName>\
              <Rotation>Rotation0</Rotation>\
              <IsMirrored>False</IsMirrored>\
              <IsVariable>True</IsVariable>\
              <HorizontalAlignment>Center</HorizontalAlignment>\
              <VerticalAlignment>Middle</VerticalAlignment>\
              <TextFitMode>AlwaysFit</TextFitMode>\
              <UseFullFontHeight>True</UseFullFontHeight>\
              <Verticalized>False</Verticalized>\
              <StyledText>\
                <Element>\
                  <String>fullname</String>\
                  <Attributes>\
                    <Font Family="Montserrat" Size="18" Bold="False" Italic="False" Underline="False" Strikeout="False" />\
                    <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
                  </Attributes>\
                </Element>\
              </StyledText>\
            </TextObject>\
            <Bounds X="270" Y="1344" Width="2790" Height="576" />\
          </ObjectInfo>\
          <ObjectInfo>\
            <TextObject>\
              <Name>organization</Name>\
              <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
              <BackColor Alpha="0" Red="255" Green="255" Blue="255" />\
              <LinkedObjectName></LinkedObjectName>\
              <Rotation>Rotation0</Rotation>\
              <IsMirrored>False</IsMirrored>\
              <IsVariable>True</IsVariable>\
              <HorizontalAlignment>Center</HorizontalAlignment>\
              <VerticalAlignment>Middle</VerticalAlignment>\
              <TextFitMode>AlwaysFit</TextFitMode>\
              <UseFullFontHeight>True</UseFullFontHeight>\
              <Verticalized>False</Verticalized>\
              <StyledText>\
                <Element>\
                  <String>organization</String>\
                  <Attributes>\
                    <Font Family="Montserrat" Size="18" Bold="False" Italic="False" Underline="False" Strikeout="False" />\
                    <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
                  </Attributes>\
                </Element>\
              </StyledText>\
            </TextObject>\
            <Bounds X="270" Y="1920" Width="2790" Height="672" />\
          </ObjectInfo>\
          <ObjectInfo>\
            <TextObject>\
              <Name>additional</Name>\
              <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
              <BackColor Alpha="0" Red="255" Green="255" Blue="255" />\
              <LinkedObjectName></LinkedObjectName>\
              <Rotation>Rotation0</Rotation>\
              <IsMirrored>False</IsMirrored>\
              <IsVariable>True</IsVariable>\
              <HorizontalAlignment>Center</HorizontalAlignment>\
              <VerticalAlignment>Middle</VerticalAlignment>\
              <TextFitMode>AlwaysFit</TextFitMode>\
              <UseFullFontHeight>True</UseFullFontHeight>\
              <Verticalized>False</Verticalized>\
              <StyledText>\
                <Element>\
                  <String>additional</String>\
                  <Attributes>\
                    <Font Family="Montserrat" Size="18" Bold="False" Italic="False" Underline="False" Strikeout="False" />\
                    <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
                  </Attributes>\
                </Element>\
              </StyledText>\
            </TextObject>\
            <Bounds X="270" Y="2496" Width="2790" Height="384" />\
          </ObjectInfo>\
        </DieCutLabel>';

      var label = dymo.label.framework.openLabelXml(labelXml);

      label.setObjectText("name", name);
      label.setObjectText("fullname", fullname);
      label.setObjectText("organization", organization);
      var additional = '';
      if (mentor) {
        if (group) {
          additional = 'MENTOR (' + group + ')';
        } else {
          additional = 'MENTOR';
        }
      } else {
        if (group) {
          additional = '(' + group + ')';
        }
      }
      label.setObjectText("additional", additional);

      // Select printer to print on
      var printers = dymo.label.framework.getPrinters();
      if (printers.length == 0) {
        throw "No DYMO printers are installed. Install DYMO printers.";
      }
      var printerName = "";
      for (var i = printers.length - 1; i >= 0; i--)
      {
        var printer = printers[i];
        if (printer.printerType == "LabelWriterPrinter")
          {
            printerName = printer.name;
            break;
          }
      }

      if (printerName == "") {
        throw "No LabelWriter printers found. Install LabelWriter printer";
      }

      label.print(printerName);
    } catch (e) {
      alert(e.message || e);
    }
  }

  var searchString = '';

  function logCheckin(person, name, legal, group, organization, mentor) {
    var log = {
      database: person,
      printed: {
        name: name,
        legal: legal,
        group: group,
        organization: organization,
        mentor: mentor,
        time: (new Date()).toISOString()
      }
    };
    $.ajax({
      url: 'http://localhost:31337',
      type: 'POST',
      data: {
        json: JSON.stringify(log)
      }
    }).fail(function(data, status) {
      alert('Error saving check-in information to disk. Is the python server running?');
    });
    //This can be done a lot better
  };

  function isTruthy(str) {
    return str == 't' || str == 'T' || str == 'true' || str == 'True' ||
      str == 'y' || str == 'Y' || str == 'yes' || str == 'Yes';
  };

  function validateInput() {
    return true;
  };

  function checkin(person) {
    var name = $('#form-name').val();
    var legal = $('#form-legal').val();
    var group = $('#form-group').val();
    var organization = $('#form-organization').val();
    var mentor = isTruthy($('#form-mentor').val());
    if (name == legal) legal = '';
    printLabel(name, legal, group, organization, mentor);
    logCheckin(person, name, legal, group, organization, mentor);
  };

  function resetForm() {
    $('#form').addClass('hidden');
    $('#form-name').val('');
    $('#form-legal').val('');
    $('#form-group').val('');
    $('#form-organization').val('');
    $('#form-mentor').val('No');
    $('#swag').text('');
    $('#shirt-size').text('');
    $('#laptop').text('');
    $('#forms').text('');
  };

  function reset() {
    resetForm();
    searchString = '';
    updateSearch();
  };

  function search() {
    if (searchString == '') return [];
    var queries = $.grep(searchString.toLowerCase().split(/[ ,]+/), function(query) {
      return query != '';
    });
    return $.grep(personData, function(elem) {
      for (var i = 0; i < queries.length; i++) {
        //console.log(elem)
        var contains = false;
        if (elem.profile.name!=undefined) {
          var terms = elem.profile.name.toLowerCase().split(/[ ,]+/)
            .concat(elem.email.toLowerCase().split(/[ ,]+/));
          
          for (var j = 0; j < terms.length; j++) {
            if (terms[j].indexOf(queries[i]) != -1) contains = true;
          }
          
        }
        if (contains == false) return false;
      }
      return true;
    });
  };

  function updateSearch() {
    var sb = $('#searchbox');
    sb.text(searchString);
    var res = $('#results');
    if (searchString == '') {
      res.empty();
    } else {
      matches = search();
      res.empty();
      for (var i = 0; i < matches.length && i < MAX_RESULTS; i++) {
        var match = matches[i];
        var name = escapeHtml(match.profile.name);
        var organization = escapeHtml(match.teamCode);
        var contents = name + ' - ' + organization;
        var node = $('<li>' + contents + '</li>');
        node.data('match', match);
        res.append(node);
      }
      var children = res.children();
      if (children.length > 0) {
        $(children[0]).addClass('selected');
      }
    }
  };

  $(document).on('keypress', function(e) {
    if (e.which == 13) {
      // ENTER
      if (!formSelected()) {
        var selected = $('.selected');
        if (selected.length > 0) {
          var match = $(selected[0]).data('match');
          $('#form').removeClass('hidden');
          var name = match.profile.name;
          var nameParts = $.grep(name.split(/[ ,]+/), function(part) {
            return part != '';
          });
          $('#form-name').val(nameParts[0] || '');
          $('#form-legal').val(name);
          console.log(match)
          var teamCode = match.teamCode;
          //console.log(teamCode)
          if (teamCode==undefined){
            teamCode = "None"
          }

          var parenLoc = teamCode.indexOf('(');
          if (parenLoc != -1) {
            teamCode = teamCode.slice(0, parenLoc - 1);
          }
          //$('#form-group').val(match.group)
          $('#form-organization').val(teamCode);
          //if (match.learnathon) {
          $('#swag').text('Day 1 Swag Recipient');
          //} else {
          //  $('#swag').text('Day 2 Swag Recipient');
          //}
          $('#shirt-size').text('Shirt Size: ' + match.confirmation.shirtSize);
          if (!match.laptop && !match.mentor) {
            $('#laptop').text('Laptop Recipient');
          }
          if (!match.status.admitted) {
            $('#forms').text('Warning: no admission!');
          }
          if (!match.status.confirmed) {
            $('#forms').text('Warning: no confirmation!');
          }
          $('#form-mentor').val(match.mentor ? 'Yes' : 'No');
          $('#form-name').focus();
        }
      } else {
        var selected = $('.selected');
        if (validateInput()) {
          checkin($(selected[0]).data('match') || {});
          reset();
        }
      }
    } else if (!formSelected()) {
      var c = String.fromCharCode(e.which);
      searchString = searchString.concat(c);
      updateSearch();
    }
  });

  function formSelected() {
    return $('#form-name').is(':focus') ||
      $('#form-legal').is(':focus') ||
      $('#form-group').is(':focus') ||
      $('#form-organization').is(':focus') ||
      $('#form-mentor').is(':focus');
  };

  $(document).on('keydown', function(e) {
    if (e.which == 8 && !formSelected()) {
      // BACKSPACE
      searchString = searchString.slice(0, -1);
      updateSearch();
    } else if (e.which == 27) {
      // ESCAPE
      if (!formSelected()) {
        reset();
      } else {
        $(':focus').blur();
        resetForm();
      }
    } else if (e.which == 40 && !formSelected()) {
      // DOWN ARROW
      var curr = $('.selected');
      var next = curr.next();
      if (next.length > 0) {
        curr.removeClass('selected');
        next.addClass('selected');
      }
    } else if (e.which == 38 && !formSelected()) {
      // UP ARROW
      var curr = $('.selected');
      var prev = curr.prev();
      if (prev.length > 0) {
        curr.removeClass('selected');
        prev.addClass('selected');
      }
    } else if (e.which == 39 && !formSelected()) {
      // RIGHT ARROW
      reset();
      $('#form').removeClass('hidden');
      $('#form-name').focus();
    }
  });

  $(document).ready(function() {
    reset();
  });

  function escapeHtml(string) {
    var entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;',
      "/": '&#x2F;'
    };
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  };
} ());
